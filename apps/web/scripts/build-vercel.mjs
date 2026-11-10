// Сборка витрины для Vercel (Build Output API v3): статика на CDN + SSR-функция,
// /api/* проксируется в dev-CMS на ВМ. Запуск: pnpm --filter @muvna/web build:vercel
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cms = (process.env.VERCEL_CMS_URL ?? 'https://dev.168-113-255-143.sslip.io').replace(/\/$/, '');
const out = path.join(root, '.vercel/output');
const run = (cmd, env = {}) =>
  execSync(cmd, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } });

rmSync(path.join(root, 'dist'), { recursive: true, force: true });
rmSync(out, { recursive: true, force: true });
run('npx vite build --outDir dist/client');
run('npx vite build --ssr src/app/entry-server.tsx --outDir dist/vercel-server', { SSR_BUNDLE_DEPS: '1' });

// статика (без index.html — страницы рендерит функция)
mkdirSync(path.join(out, 'static'), { recursive: true });
for (const entry of readdirSync(path.join(root, 'dist/client'))) {
  if (entry !== 'index.html')
    cpSync(path.join(root, 'dist/client', entry), path.join(out, 'static', entry), { recursive: true });
}

// функция
const fn = path.join(out, 'functions/render.func');
mkdirSync(fn, { recursive: true });
cpSync(path.join(root, 'dist/vercel-server'), fn, { recursive: true });
cpSync(path.join(root, 'dist/client/index.html'), path.join(fn, 'template.html'));
cpSync(path.join(root, 'vercel/render.mjs'), path.join(fn, 'index.mjs'));
writeFileSync(path.join(fn, 'package.json'), JSON.stringify({ type: 'module' }));
writeFileSync(
  path.join(fn, '.vc-config.json'),
  JSON.stringify(
    {
      runtime: 'nodejs22.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      maxDuration: 30,
      // регион функции (fra1) задаётся на уровне проекта — см. .github/workflows/vercel.yml
    },
    null,
    2,
  ),
);

writeFileSync(
  path.join(out, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: '/assets/(.*)',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
        // dev-окружение — не индексируется
        { src: '/(.*)', headers: { 'X-Robots-Tag': 'noindex, nofollow' }, continue: true },
        { handle: 'filesystem' },
        // REST API и медиа — из dev-CMS (заказы и заявки уходят туда же)
        { src: '/api/(.*)', dest: `${cms}/api/$1` },
        // всё остальное — SSR
        { src: '/(.*)', dest: '/render?__path=/$1' },
      ],
    },
    null,
    2,
  ),
);
console.log(`[vercel] .vercel/output готов: статика + render.func, CMS: ${cms}`);
