import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import './model';

import { CartPage } from './ui/CartPage';

export const CartRoute = createRouteView({ route: routes.cart, view: CartPage });
