import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { createPageModel } from '@/entities/page';

import { createModel, createRetry } from '@/shared/lib';
import { routes } from '@/shared/routing';

export const HomeModel = createModel(() => {
  const query = invoke(createPageModel);

  sample({ clock: routes.home.opened, fn: () => 'home', target: query.start });

  return {
    viewModel: {
      page: query.$data,
      error: query.$error,
      isLoading: query.$isInitialLoading,
      onRetryClick: createRetry(query),
    },
  };
});
