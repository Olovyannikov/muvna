import { fileURLToPath, URL } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const cms = process.env.CMS_URL ?? 'http://localhost:3000';

export default defineConfig(({ command }) => ({
  plugins: [
    // sid для юнитов: по ним serialize/fork переносит состояние с сервера на клиент.
    // Фабрики вызываются через invoke из @withease/factories — плагин учитывает его сам.
    babel({
      include: /[\\/]src[\\/].*\.[jt]sx?$/,
      plugins: [
        ['effector/babel-plugin', { hmr: command === 'serve' && !process.env.VITEST ? 'es' : false }],
      ],
    }),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // API, медиа и админка живут в CMS — в проде это тот же домен (Caddy), в dev проксируем.
    proxy: { '/api': cms },
  },
  // Для Vercel SSR-бандл самодостаточный: зависимости внутри, node_modules функции не нужны.
  ssr: process.env.SSR_BUNDLE_DEPS === '1' ? { noExternal: true, target: 'node' } : undefined,
  test: { environment: 'jsdom', globals: false },
}));
