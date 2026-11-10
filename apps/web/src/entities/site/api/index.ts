import { createRequestFx } from 'effector-refetch';

import { payloadRequest, type Category, type PaginatedDocs, type Section, type Site } from '@/shared/api';
import type { Locale } from '@/shared/i18n';

export interface NavCategory {
  id: number;
  title: string;
  href: string;
}

export interface NavSection {
  id: number;
  title: string;
  slug: string;
  categories: NavCategory[];
}

export const fetchSiteFx = createRequestFx<{ locale: Locale }, Site>(({ locale }, { signal }) =>
  payloadRequest<Site>('/globals/site', { query: { depth: 1 }, locale, signal }),
);

export const fetchNavigationFx = createRequestFx<{ locale: Locale }, NavSection[]>(
  async ({ locale }, { signal }) => {
    const { docs } = await payloadRequest<PaginatedDocs<Section>>('/sections', {
      query: {
        limit: 50,
        sort: '_order',
        depth: 1,
        joins: { categories: { sort: '_order', limit: 100 } },
      },
      locale,
      signal,
    });
    return docs.map((section) => ({
      id: section.id,
      title: section.title,
      slug: section.slug,
      categories: (section.categories?.docs ?? [])
        .filter((category): category is Category => typeof category === 'object')
        .map((category) => ({
          id: category.id,
          title: category.title,
          href: `/${section.slug}/${category.slug}`,
        })),
    }));
  },
);
