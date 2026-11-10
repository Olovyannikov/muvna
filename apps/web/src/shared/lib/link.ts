import { siteOrigin } from '../config';

const INTERNAL_HOSTS = /(^|\.)muvna\.ru$/;

/** Внутренние ссылки CMS бывают абсолютными (https://muvna.ru/espresso) — приводим к пути. */
export const normalizeHref = (url: string | null | undefined): string => {
  if (!url) return '#';
  if (/^(mailto|tel):/.test(url)) return url;
  try {
    const parsed = new URL(url, siteOrigin);
    if (parsed.origin === siteOrigin || INTERNAL_HOSTS.test(parsed.hostname)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return url;
  }
};

export const isExternalHref = (href: string): boolean =>
  /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);
