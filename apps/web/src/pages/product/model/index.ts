import { invoke } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';
import { attachToRoute, createQuery, keepFresh } from 'effector-refetch';

import { fetchProductFx } from '@/entities/product';

import type { Product } from '@/shared/api';
import { $locale, $t, type Locale } from '@/shared/i18n';
import {
  createModel,
  createPageStatus,
  createRetry,
  isNotFound,
  mediaUrl,
  metaChanged,
  retryTransient,
  syncLivePreview,
} from '@/shared/lib';
import { routes } from '@/shared/routing';

type RouteParams = { section: string; category: string; product: string };

export const ProductModel = createModel(() => {
  const query = createQuery({
    name: 'product',
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
    fn: ({ result }) => {
      const image = mediaUrl(result.image, 'card');
      return {
        title: result.meta?.title || result.title,
        description: result.meta?.description || result.note || result.materials,
        image,
        type: 'product' as const,
        // Карточка товара для поисковиков: цена, наличие, артикул.
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: result.title,
          sku: result.sku ?? undefined,
          image: image ? [image] : undefined,
          brand: { '@type': 'Brand', name: 'MUVNA' },
          offers: {
            '@type': 'Offer',
            price: result.price,
            priceCurrency: 'RUB',
            availability:
              result.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
        },
      };
    },
    target: metaChanged,
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

  sample({
    clock: query.finished.fail,
    source: $t,
    filter: (_, { error }) => isNotFound(error),
    fn: (t) => ({ title: t('errors.notFoundTitle') }),
    target: metaChanged,
  });

  return {
    /** Идёт загрузка данных страницы (для индикатора навигации). */
    $loading: query.$pending,
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
