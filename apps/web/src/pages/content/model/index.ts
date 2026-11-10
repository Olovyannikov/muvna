import { invoke } from '@withease/factories';
import { sample } from 'effector';

import { createPageModel } from '@/entities/page';

import { createModel, createPageStatus, createRetry } from '@/shared/lib';
import { reservedSlugs, routes } from '@/shared/routing';

export const ContentModel = createModel(() => {
  const query = invoke(createPageModel);

  // /:slug перекрывается со статичными маршрутами (/cart) — их в CMS не запрашиваем.
  sample({
    clock: [routes.page.opened, routes.page.updated],
    filter: ({ params }) => !reservedSlugs.has(params.slug),
    fn: ({ params }) => params.slug,
    target: query.start,
  });

  sample({ clock: routes.page.closed, target: query.reset });

  return {
    viewModel: {
      status: createPageStatus(query),
      page: query.$data,
      onRetryClick: createRetry(query),
    },
  };
});
