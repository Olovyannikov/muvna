import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { createPageModel } from '@/entities/page';

import { createModel, createPageStatus, createRetry } from '@/shared/lib';
import { routes } from '@/shared/routing';

export const HomeModel = createModel(() => {
  const query = invoke(createPageModel, 'home');

  sample({ clock: routes.home.opened, fn: () => 'home', target: query.start });

  return {
    viewModel: {
      status: createPageStatus(query),
      page: query.$data,
      onRetryClick: createRetry(query),
    },
  };
});
