import { createFactory, invoke } from '@withease/factories';
import { sample } from 'effector';
import { createQuery, keepFresh } from 'effector-refetch';

import type { Page } from '@/shared/api';
import { $locale, type Locale } from '@/shared/i18n';
import { retryTransient, setDocumentMetaFx, syncLivePreview } from '@/shared/lib';

import { fetchPageFx } from '../api';

/**
 * Запрос страницы-конструктора по slug: язык из $locale, перезапрос при смене языка,
 * правки из Live Preview, <title>/description по SEO-полям страницы.
 */
export const createPageModel = createFactory(() => {
  const query = createQuery({
    effect: fetchPageFx,
    source: { locale: $locale },
    mapParams: (slug: string, { locale }: { locale: Locale }) => ({ slug, locale }),
    retry: retryTransient,
  });

  keepFresh(query, { source: $locale });

  invoke(syncLivePreview<Page>, {
    query,
    collection: 'pages',
    docId: (page) => page.id,
    apply: (_, doc) => doc as unknown as Page,
    depth: 3,
  });

  sample({
    clock: query.finished.done,
    fn: ({ result }) => ({
      title: result.meta?.title || result.title,
      description: result.meta?.description,
    }),
    target: setDocumentMetaFx,
  });

  return query;
});
