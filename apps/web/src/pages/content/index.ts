import { createRouteView } from '@effector/router-react';

import { routes } from '@/shared/routing';

import { ContentModel } from './model';
import { ContentPage } from './ui/ContentPage';

export const ContentRoute = createRouteView({ route: routes.page, view: ContentPage });

export const $contentLoading = ContentModel.$loading;
