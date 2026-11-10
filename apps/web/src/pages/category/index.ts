import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import { CategoryModel } from './model';
import { CategoryPage } from './ui/CategoryPage';

export const CategoryRoute = createRouteView({ route: routes.category, view: CategoryPage });

export const $categoryLoading = CategoryModel.$loading;
