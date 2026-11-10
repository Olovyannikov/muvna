import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import './model';

import { CategoryPage } from './ui/CategoryPage';

export const CategoryRoute = createRouteView({ route: routes.category, view: CategoryPage });
