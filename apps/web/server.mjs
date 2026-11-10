// SSR-сервер витрины: в dev — Vite в middleware-режиме (HMR, прокси /api), в проде — сборка из dist.
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT ?? 5173);
const publicUrl = (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, '');
const cmsUrl = (process.env.CMS_INTERNAL_URL ?? 'http://localhost:3000').replace(/\/$/, '');

let vite;
let serveStatic;
let prodTemplate;
let prodRender;

if (isProd) {
  const { default: sirv } = await import('sirv');
  // Хешированные ассеты Vite кэшируются навсегда, остальное — без index.html (его рендерит SSR).
  serveStatic = sirv(path.join(root, 'dist/client'), {
    gzip: true,
    brotli: true,
    setHeaders: (res, pathname) => {
      if (pathname.startsWith('/assets/'))
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  });
  prodTemplate = await readFile(path.join(root, 'dist/client/index.html'), 'utf8');
  ({ render: prodRender } = await import('./dist/server/entry-server.js'));
} else {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'custom' });
}

// ——— sitemap.xml: все опубликованные страницы, категории и товары на обоих языках ———
const LOCALES = ['ru', 'en'];
const localized = (pathname, locale) =>
  locale === 'ru' ? pathname : pathname === '/' ? '/en' : `/en${pathname}`;
let sitemapCache = { xml: '', at: 0 };

const cms = (query) => fetch(`${cmsUrl}/api/${query}`).then((r) => (r.ok ? r.json() : { docs: [] }));

const buildSitemap = async () => {
  if (Date.now() - sitemapCache.at < 10 * 60_000 && sitemapCache.xml) return sitemapCache.xml;
  const [pages, categories, products] = await Promise.all([
    cms('pages?limit=500&depth=0&select[slug]=true&select[updatedAt]=true'),
    cms('categories?limit=500&depth=1&select[slug]=true&select[section]=true&select[updatedAt]=true'),
    cms('products?limit=2000&depth=2&select[slug]=true&select[category]=true&select[updatedAt]=true'),
  ]);
  const entries = [
    ...pages.docs.map((p) => ({ path: p.slug === 'home' ? '/' : `/${p.slug}`, updatedAt: p.updatedAt })),
    ...categories.docs
      .filter((c) => c.section?.slug)
      .map((c) => ({ path: `/${c.section.slug}/${c.slug}`, updatedAt: c.updatedAt })),
    ...products.docs
      .filter((p) => p.category?.section?.slug)
      .map((p) => ({
        path: `/${p.category.section.slug}/${p.category.slug}/${p.slug}`,
        updatedAt: p.updatedAt,
      })),
  ];
  const urls = entries.flatMap(({ path: pathname, updatedAt }) =>
    LOCALES.map(
      (locale) => `  <url>
    <loc>${publicUrl}${localized(pathname, locale)}</loc>
    <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
${LOCALES.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${publicUrl}${localized(pathname, alt)}"/>`).join('\n')}
  </url>`,
    ),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  sitemapCache = { xml, at: Date.now() };
  return xml;
};

const robots = `User-agent: *
Allow: /
Disallow: /cart
Disallow: /en/cart
Disallow: /admin
Disallow: /api/

Sitemap: ${publicUrl}/sitemap.xml
`;

const renderPage = async (req, res) => {
  const url = req.url ?? '/';
  try {
    if (url === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(robots);
      return;
    }
    if (url === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' }).end(await buildSitemap());
      return;
    }

    let template = prodTemplate;
    let render = prodRender;
    if (vite) {
      template = await vite.transformIndexHtml(url, await readFile(path.join(root, 'index.html'), 'utf8'));
      ({ render } = await vite.ssrLoadModule('/src/app/entry-server.tsx'));
    }

    const page = await render(url);
    const html = template
      .replace('<html lang="ru">', `<html lang="${page.locale}">`)
      .replace('<!--app-head-->', page.head)
      .replace('<!--app-html-->', page.html)
      .replace('<!--app-state-->', page.state);

    res
      .writeHead(page.status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
      .end(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Internal Server Error');
  }
};

// Статикой отдаём только файлы (/assets/…, /favicon.svg); страницы — всегда через SSR,
// в том числе «/» (иначе sirv отдал бы сырой шаблон index.html).
const isFile = (url = '/') =>
  /\.[a-z0-9]+$/i.test(url.split('?')[0]) &&
  !url.startsWith('/sitemap.xml') &&
  !url.startsWith('/robots.txt');

createServer((req, res) => {
  const next = () => void renderPage(req, res);
  if (vite) vite.middlewares(req, res, next);
  else if (isFile(req.url)) serveStatic(req, res, next);
  else next();
}).listen(port, () => {
  console.log(`[web] ${isProd ? 'production' : 'dev'} SSR on http://localhost:${port}`);
});
