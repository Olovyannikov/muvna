import type { Locale } from '@/shared/i18n';
import { formatTitle, type DocumentMeta } from '@/shared/lib';
import { withLocale } from '@/shared/routing';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const absolute = (origin: string, url: string) => (/^https?:\/\//.test(url) ? url : `${origin}${url}`);

/** <head> страницы для SSR: title, description, canonical, hreflang, Open Graph, JSON-LD. */
export const renderHead = ({
  meta,
  path,
  locale,
  origin,
}: {
  meta: DocumentMeta;
  /** Путь без языкового префикса. */
  path: string;
  locale: Locale;
  origin: string;
}): string => {
  const title = escape(formatTitle(meta.title));
  const url = `${origin}${withLocale(path, locale)}`;
  const tags = [
    `<title>${title}</title>`,
    meta.description && `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="ru" href="${origin}${withLocale(path, 'ru')}" />`,
    `<link rel="alternate" hreflang="en" href="${origin}${withLocale(path, 'en')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${origin}${withLocale(path, 'ru')}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="MUVNA" />`,
    `<meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'ru_RU'}" />`,
    `<meta property="og:title" content="${title}" />`,
    meta.description && `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    meta.image && `<meta property="og:image" content="${escape(absolute(origin, meta.image))}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
    meta.jsonLd &&
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
};
