import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import './model';

import { HomePage } from './ui/HomePage';

export const HomeRoute = createRouteView({ route: routes.home, view: HomePage });
