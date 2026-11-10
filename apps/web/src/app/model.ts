import { createEffect, sample } from 'effector';
import { createGate } from 'effector-react';
import { or } from 'patronum';

import { $categoryLoading } from '@/pages/category';
import { $contentLoading } from '@/pages/content';
import { $homeLoading } from '@/pages/home';
import { $productLoading } from '@/pages/product';

import { SiteModel } from '@/entities/site';

import { $t } from '@/shared/i18n';
import { appMounted, appStarted, metaChanged, startLivePreviewFx } from '@/shared/lib';
import { router, routes } from '@/shared/routing';

const scrollToTopFx = createEffect(() => {
  if (typeof window !== 'undefined' && !window.location.hash)
    window.scrollTo({ top: 0, behavior: 'instant' });
});

sample({
  clock: appStarted,
  target: [SiteModel.siteQuery.start, SiteModel.navigationQuery.start],
});

/**
 * Открывается, когда React закончил гидратацию (эффекты Gate идут после коммита).
 * Только после этого можно трогать браузерное состояние — иначе разметка разойдётся с серверной.
 */
export const AppGate = createGate({ name: 'app' });

sample({ clock: AppGate.open, target: appMounted });
sample({ clock: appMounted, target: startLivePreviewFx });

// Новая страница — к началу (кроме якорных ссылок).
sample({ clock: router.updated, filter: (prev) => Boolean(prev), target: scrollToTopFx });

sample({
  clock: routes.notFound.opened,
  source: $t,
  fn: (t) => ({ title: t('errors.notFoundTitle') }),
  target: metaChanged,
});

/** Грузится какая-то страница — показываем полосу прогресса вверху. */
export const $isNavigating = or($homeLoading, $contentLoading, $categoryLoading, $productLoading);
