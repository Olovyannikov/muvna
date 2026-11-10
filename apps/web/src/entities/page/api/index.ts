import { createRequestFx } from 'effector-refetch';

import { findOne, type Page } from '@/shared/api';
import type { Locale } from '@/shared/i18n';

export const fetchPageFx = createRequestFx<{ slug: string; locale: Locale }, Page>(
  ({ slug, locale }, { signal }) =>
    findOne<Page>('pages', { where: { slug: { equals: slug } }, depth: 3 }, { locale, signal }),
);
