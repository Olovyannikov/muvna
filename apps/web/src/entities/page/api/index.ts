import { createRequestFx } from 'effector-refetch';

import { findOne, productCardSelect, type Page } from '@/shared/api';
import type { Locale } from '@/shared/i18n';

export const fetchPageFx = createRequestFx<{ slug: string; locale: Locale }, Page>(
  ({ slug, locale }, { signal }) =>
    findOne<Page>(
      'pages',
      {
        where: { slug: { equals: slug } },
        depth: 3,
        // Товары в блоках «Подборка» — только поля карточки (+ категория/раздел для ссылки).
        populate: {
          products: productCardSelect,
          categories: { slug: true, section: true },
          sections: { slug: true },
        },
      },
      { locale, signal },
    ),
);
