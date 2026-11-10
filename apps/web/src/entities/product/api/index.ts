import { createRequestFx } from 'effector-refetch';

import { findOne, type Product } from '@/shared/api';
import type { Locale } from '@/shared/i18n';

export interface ProductParams {
  section: string;
  category: string;
  product: string;
  locale: Locale;
}

export const fetchProductFx = createRequestFx<ProductParams, Product>((params, { signal }) =>
  findOne<Product>(
    'products',
    {
      where: {
        and: [{ slug: { equals: params.product } }, { 'category.slug': { equals: params.category } }],
      },
      depth: 3,
    },
    { locale: params.locale, signal },
  ),
);
