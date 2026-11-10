import { createRoute, createRouter } from '@effector/router';
import { createEffect, createEvent, createStore, sample, scopeBind } from 'effector';
import { createAction } from 'effector-action';
import type { History } from 'history';

import { localeChanged, type Locale } from '../i18n';
import { localeOf, localizedAdapter, stripLocale, withLocale } from './locale';

export { localeOf, stripLocale, withLocale } from './locale';

export const routes = {
  home: createRoute({ path: '/' }),
  cart: createRoute({ path: '/cart' }),
  /** Страница-конструктор из CMS: /cooperation, /contact, /privacy… */
  page: createRoute({ path: '/:slug' }),
  category: createRoute({ path: '/:section/:category' }),
  product: createRoute({ path: '/:section/:category/:product' }),
  notFound: createRoute(),
};

/** Пути, которые заняты собственными маршрутами и не должны уходить в CMS как страницы. */
export const reservedSlugs = new Set(['cart']);

export const router = createRouter({
  routes: [routes.home, routes.cart, routes.page, routes.category, routes.product],
  notFound: routes.notFound,
});

/**
 * Подключение истории: браузерной в клиенте, memory — на сервере (из URL запроса).
 * Роутер получает адаптер без языкового префикса, язык берётся из URL.
 */
export const historyAttached = createEvent<History>();

const $history = createStore<History | null>(null, { serialize: 'ignore' }).on(
  historyAttached,
  (_, history) => history,
);

sample({ clock: historyAttached, fn: localizedAdapter, target: router.setHistory });
sample({
  clock: historyAttached,
  fn: (history) => localeOf(history.location.pathname),
  target: localeChanged,
});

// Язык меняется и при нативной навигации (назад с /en/... на /...).
const listenLocaleFx = createEffect((history: History) => {
  const changed = scopeBind(localeChanged, { safe: true });
  history.listen(({ location }) => changed(localeOf(location.pathname)));
});
sample({ clock: historyAttached, target: listenLocaleFx });

/** Переключение языка из UI: тот же путь под другим префиксом. */
export const localeSwitched = createEvent<Locale>();

const switchLocaleFx = createEffect(({ history, locale }: { history: History; locale: Locale }) => {
  const { pathname, search, hash } = history.location;
  history.push({ pathname: withLocale(stripLocale(pathname), locale), search, hash });
});

createAction(localeSwitched, {
  source: { history: $history },
  target: { switchLocale: switchLocaleFx },
  fn: (target, { history }, locale) => {
    if (history) target.switchLocale({ history, locale });
  },
});
