import { createRoute, createRouter, historyAdapter } from '@effector/router';
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

sample({
  clock: appStarted,
  fn: () => historyAdapter(createBrowserHistory()),
  target: router.setHistory,
});
