// Vercel Function: SSR витрины. Собирается scripts/build-vercel.mjs рядом с бандлом entry-server.js.
import { readFileSync } from 'node:fs';

// Контент — из dev-CMS на ВМ (админка живёт там же, на Vercel её нет).
process.env.CMS_INTERNAL_URL ??= 'https://dev.168-113-255-143.sslip.io';

const template = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
const { render } = await import('./entry-server.js');

/** @param {import('node:http').IncomingMessage} req @param {import('node:http').ServerResponse} res */
export default async function handler(req, res) {
  // Маршрут Vercel передаёт исходный путь в __path (остальной query сохраняется).
  const incoming = new URL(req.url ?? '/', 'http://local');
  const pathname = incoming.searchParams.get('__path') || incoming.pathname;
  incoming.searchParams.delete('__path');
  const search = incoming.searchParams.toString();
  const url = `${pathname}${search ? `?${search}` : ''}`;

  if (pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end('User-agent: *\nDisallow: /\n');
    return;
  }

  try {
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
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Internal Server Error');
  }
}
