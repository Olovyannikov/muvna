import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import './model';

import { ProductPage } from './ui/ProductPage';

export const ProductRoute = createRouteView({ route: routes.product, view: ProductPage });
