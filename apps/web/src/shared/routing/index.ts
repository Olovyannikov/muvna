import { createRoute, createRouter, historyAdapter, type RouterAdapter } from '@effector/router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';

import { appStarted } from '../lib/app';

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
 * Адаптер без нативной блокировки POP-переходов.
 *
 * В @effector/router 1.2.0 блокировщик после «разрешения» перехода делает
 * runWithoutBlocking(() => transition.retry()), но retry в history v5 — это асинхронный
 * history.go(): popstate приходит уже после повторной установки блока, и кнопка «назад»
 * зацикливается (URL мигает между страницами). Блокировка нужна только для beforeNavigate,
 * который мы не используем, а `block` в RouterAdapter опционален.
 */
const withoutNativeBlocking = (adapter: RouterAdapter): RouterAdapter => {
  // Копируем дескрипторы, чтобы сохранить «живой» getter location.
  const { block: _block, ...descriptors } = Object.getOwnPropertyDescriptors(adapter);
  return Object.defineProperties({}, descriptors) as RouterAdapter;
};

sample({
  clock: appStarted,
  fn: () => withoutNativeBlocking(historyAdapter(createBrowserHistory())),
  target: router.setHistory,
});
