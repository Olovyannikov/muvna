import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { attachToRoute, createQuery, keepFresh } from 'effector-refetch';

import { fetchProductFx } from '@/entities/product';

import type { Product } from '@/shared/api';
import { $locale, type Locale } from '@/shared/i18n';
import {
  createModel,
  createPageStatus,
  createRetry,
  retryTransient,
  setDocumentMetaFx,
  syncLivePreview,
} from '@/shared/lib';
import { routes } from '@/shared/routing';

type RouteParams = { section: string; category: string; product: string };

export const ProductModel = createModel(() => {
  const query = createQuery({
    effect: fetchProductFx,
    source: { locale: $locale },
    mapParams: (params: RouteParams, { locale }: { locale: Locale }) => ({ ...params, locale }),
    retry: retryTransient,
    cache: { staleAfter: 60_000 },
  });

  attachToRoute({ route: routes.product, query, mapParams: ({ params }) => params });
  keepFresh(query, { source: $locale });

  invoke(syncLivePreview<Product>, {
    query,
    collection: 'products',
    docId: (product) => product.id,
    apply: (_, doc) => doc as unknown as Product,
    depth: 3,
  });

  sample({
    clock: query.finished.done,
    fn: ({ result }) => ({
      title: result.meta?.title || result.title,
      description: result.meta?.description || result.note,
    }),
    target: setDocumentMetaFx,
  });

  // Выбранное фото галереи и количество — состояние страницы, сбрасывается при смене товара.
  const imageSelected = createEvent<number>();
  const quantitySet = createEvent<number>();

  const $activeImage = createStore(0)
    .on(imageSelected, (_, index) => index)
    .reset(routes.product.opened, routes.product.updated);

  const $quantity = createStore(1)
    .on(quantitySet, (_, quantity) => Math.max(1, quantity))
    .reset(routes.product.opened, routes.product.updated);

  return {
    viewModel: {
      status: createPageStatus(query),
      product: query.$data,
      href: routes.product.$params.map(
        ({ section, category, product }) => `/${section}/${category}/${product}`,
      ),
      activeImage: $activeImage,
      quantity: $quantity,
      onImageSelect: imageSelected,
      onQuantityChange: quantitySet,
      onRetryClick: createRetry(query),
    },
  };
});
