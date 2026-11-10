const webUrl = () => (process.env.WEB_URL ?? 'http://localhost:5173').replace(/\/$/, '');

/** Адрес страницы фронтенда для iframe Live Preview / кнопки «Предпросмотр». */
export const previewUrl = (path: string): string =>
  `${webUrl()}${path}${path.includes('?') ? '&' : '?'}preview=1`;

export const pagePath = (slug?: string | null): string => (!slug || slug === 'home' ? '/' : `/${slug}`);
