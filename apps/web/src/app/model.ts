import { createEffect, sample } from 'effector';

import { SiteModel } from '@/entities/site';

import { $t } from '@/shared/i18n';
import { appStarted, setDocumentMetaFx, startLivePreviewFx } from '@/shared/lib';
import { router, routes } from '@/shared/routing';

const scrollToTopFx = createEffect(() => {
  if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
});

sample({
  clock: appStarted,
  target: [SiteModel.siteQuery.start, SiteModel.navigationQuery.start, startLivePreviewFx],
});

// Новая страница — к началу (кроме якорных ссылок).
sample({ clock: router.updated, filter: (prev) => Boolean(prev), target: scrollToTopFx });

sample({
  clock: routes.notFound.opened,
  source: $t,
  fn: (t) => ({ title: t('errors.notFoundTitle') }),
  target: setDocumentMetaFx,
});
