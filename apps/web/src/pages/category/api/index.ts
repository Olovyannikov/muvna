import { createRequestFx } from 'effector-refetch';

import {
  findOne,
  payloadRequest,
  type Category,
  type PaginatedDocs,
  type Product,
  type Series,
} from '@/shared/api';
import type { Locale } from '@/shared/i18n';

export interface SeriesGroup {
  /** null — товары категории, не привязанные к серии. */
  series: Series | null;
  products: Product[];
}

export interface CategoryView {
  category: Category;
  groups: SeriesGroup[];
}

export interface CategoryParams {
  section: string;
  category: string;
  locale: Locale;
}

const seriesId = (product: Product) =>
  typeof product.series === 'object' ? product.series?.id : (product.series ?? undefined);

/** Собирает витрину категории: серии по порядку, в каждой — свои товары. */
export const groupBySeries = (series: Series[], products: Product[]): SeriesGroup[] => {
  const groups: SeriesGroup[] = series.map((item) => ({
    series: item,
    products: products.filter((product) => seriesId(product) === item.id),
  }));
  const known = new Set(series.map((item) => item.id));
  const loose = products.filter((product) => {
    const id = seriesId(product);
    return id === undefined || !known.has(id);
  });
  if (loose.length) groups.push({ series: null, products: loose });
  return groups;
};

export const fetchCategoryFx = createRequestFx<CategoryParams, CategoryView>(async (params, { signal }) => {
  const category = await findOne<Category>(
    'categories',
    {
      where: { and: [{ slug: { equals: params.category } }, { 'section.slug': { equals: params.section } }] },
      depth: 1,
      joins: { series: false },
    },
    { locale: params.locale, signal },
  );

  const byCategory = { where: { category: { equals: category.id } }, sort: '_order', limit: 300, depth: 1 };
  const [series, products] = await Promise.all([
    payloadRequest<PaginatedDocs<Series>>('/series', {
      query: { ...byCategory, joins: { products: false } },
      locale: params.locale,
      signal,
    }),
    payloadRequest<PaginatedDocs<Product>>('/products', { query: byCategory, locale: params.locale, signal }),
  ]);

  return { category, groups: groupBySeries(series.docs, products.docs) };
});
