import { createFactory, invoke } from '@withease/factories';
import { sample } from 'effector';
import { createQuery, keepFresh } from 'effector-refetch';

import type { Page } from '@/shared/api';
import { $locale, $t, type Locale } from '@/shared/i18n';
import { isNotFound, mediaUrl, metaChanged, retryTransient, syncLivePreview } from '@/shared/lib';

import { fetchPageFx } from '../api';

/**
 * Запрос страницы-конструктора по slug: язык из $locale, перезапрос при смене языка,
 * правки из Live Preview, <title>/description по SEO-полям страницы.
 */
export const createPageModel = createFactory((name: string) => {
  const query = createQuery({
    // name — стабильные sid сторов запроса для SSR (serialize → fork({ values })).
    name,
    effect: fetchPageFx,
    source: { locale: $locale },
    mapParams: (slug: string, { locale }: { locale: Locale }) => ({ slug, locale }),
    retry: retryTransient,
    cache: { staleAfter: 60_000 },
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
      image: mediaUrl(result.meta?.image, 'card'),
    }),
    target: metaChanged,
  });

  sample({
    clock: query.finished.fail,
    source: $t,
    filter: (_, { error }) => isNotFound(error),
    fn: (t) => ({ title: t('errors.notFoundTitle') }),
    target: metaChanged,
  });

  return query;
});
