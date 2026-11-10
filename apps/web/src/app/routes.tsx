import { createRoutesView, createRouteView } from '@effector/router-react';

import { CartRoute } from '@/pages/cart';
import { CategoryRoute } from '@/pages/category';
import { ContentRoute } from '@/pages/content';
import { HomeRoute } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { ProductRoute } from '@/pages/product';

import { routes } from '@/shared/routing';

// При совпадении нескольких маршрутов побеждает последний: /cart важнее /:slug.
export const RoutesView = createRoutesView({
  routes: [
    ContentRoute,
    HomeRoute,
    CartRoute,
    CategoryRoute,
    ProductRoute,
    createRouteView({ route: routes.notFound, view: NotFoundPage }),
  ],
});
