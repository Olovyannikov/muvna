import type { RouterAdapter, RouterLocation } from '@effector/router';
import type { History } from 'history';

import { defaultLocale, locales, type Locale } from '../i18n';

const PREFIX = /^\/(en)(?=\/|$)/;

/** /en/espresso → en, всё остальное — язык по умолчанию. */
export const localeOf = (pathname: string): Locale => {
  const match = PREFIX.exec(pathname);
  return match && locales.includes(match[1] as Locale) ? (match[1] as Locale) : defaultLocale;
};

/** /en/espresso → /espresso */
export const stripLocale = (pathname: string): string => pathname.replace(PREFIX, '') || '/';

/** /espresso + en → /en/espresso */
export const withLocale = (pathname: string, locale: Locale): string => {
  const clean = stripLocale(pathname);
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
};

type To = Parameters<RouterAdapter['push']>[0];

const strip = (location: RouterLocation): RouterLocation => ({
  ...location,
  pathname: stripLocale(location.pathname),
});

const toObject = (to: To, base: RouterLocation) => {
  if (typeof to !== 'string')
    return { pathname: to.pathname ?? base.pathname, search: to.search ?? '', hash: to.hash ?? '' };
  const url = new URL(to, 'http://local.invalid');
  return { pathname: url.pathname, search: url.search, hash: url.hash };
};

/**
 * Адаптер для @effector/router поверх history: роутер видит пути без языкового префикса,
 * а навигация сохраняет текущий язык (/en/... остаётся на /en/...).
 *
 * Нативная блокировка POP не прокидывается: в @effector/router 1.2.0 она зацикливает «назад»
 * (effector/router#128), а beforeNavigate мы не используем.
 */
export const localizedAdapter = (history: History): RouterAdapter => {
  const current = () => history.location;
  const go = (method: 'push' | 'replace') => (to: To) => {
    const target = toObject(to, strip(current()));
    history[method]({ ...target, pathname: withLocale(target.pathname, localeOf(current().pathname)) });
  };
  return {
    get location() {
      return strip(current());
    },
    push: go('push'),
    replace: go('replace'),
    goBack: () => history.back(),
    goForward: () => history.forward(),
    listen: (callback) => {
      const stop = history.listen(({ location }) => callback(strip(location)));
      return Object.assign(stop, { unsubscribe: stop });
    },
  };
};
