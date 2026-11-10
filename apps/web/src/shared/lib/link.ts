/** Внутренние ссылки CMS бывают абсолютными (https://muvna.ru/espresso) — приводим к пути. */
export const normalizeHref = (url: string | null | undefined): string => {
  if (!url) return '#';
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin === window.location.origin || /(^|\.)muvna\.ru$/.test(parsed.hostname)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return url;
  }
};

export const isExternalHref = (href: string): boolean =>
  /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
