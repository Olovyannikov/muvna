import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { attachToRoute, createQuery, keepFresh } from 'effector-refetch';

import type { Category, Series } from '@/shared/api';
import { $locale, type Locale } from '@/shared/i18n';
import { createModel, createRetry, retryTransient, setDocumentMetaFx, syncLivePreview } from '@/shared/lib';
import { routes } from '@/shared/routing';

import { fetchCategoryFx, type CategoryView } from '../api';

type RouteParams = { section: string; category: string };

export const CategoryModel = createModel(() => {
  const query = createQuery({
    effect: fetchCategoryFx,
    source: { locale: $locale },
    mapParams: (params: RouteParams, { locale }: { locale: Locale }) => ({ ...params, locale }),
    retry: retryTransient,
    cache: { staleAfter: 60_000 },
  });

  attachToRoute({ route: routes.category, query, mapParams: ({ params }) => params });
  keepFresh(query, { source: $locale });

  // Live Preview: правки обложки категории и описаний серий.
  invoke(syncLivePreview<CategoryView>, {
    query,
    collection: 'categories',
    docId: (view) => view.category.id,
    apply: (view, doc) => ({ ...view, category: doc as unknown as Category }),
  });

  invoke(syncLivePreview<CategoryView>, {
    query,
    collection: 'series',
    apply: (view, doc) => ({
      ...view,
      groups: view.groups.map((group) =>
        group.series?.id === doc.id ? { ...group, series: doc as unknown as Series } : group,
      ),
    }),
  });

  sample({
    clock: query.finished.done,
    fn: ({ result: { category } }) => ({
      title: category.meta?.title || category.title,
      description: category.meta?.description,
    }),
    target: setDocumentMetaFx,
  });

  return {
    viewModel: {
      view: query.$data,
      error: query.$error,
      isLoading: query.$isInitialLoading,
      basePath: routes.category.$params.map(({ section, category }) => `/${section}/${category}`),
      onRetryClick: createRetry(query),
    },
  };
});
