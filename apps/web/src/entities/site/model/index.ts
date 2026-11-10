import { invoke } from '@withease/factories';
import { createQuery, keepFresh } from 'effector-refetch';

import type { Site } from '@/shared/api';
import { $locale, type Locale } from '@/shared/i18n';
import { createModel, syncLivePreview } from '@/shared/lib';

import { fetchNavigationFx, fetchSiteFx } from '../api';

const localized = {
  source: { locale: $locale },
  mapParams: (_: void, { locale }: { locale: Locale }) => ({ locale }),
};

/** Общие данные сайта: настройки (шапка, подвал, контакты) и дерево каталога для меню. */
export const SiteModel = createModel(() => {
  const siteQuery = createQuery({ effect: fetchSiteFx, retry: 2, ...localized });
  const navigationQuery = createQuery({ effect: fetchNavigationFx, retry: 2, ...localized });

  keepFresh(siteQuery, { source: $locale });
  keepFresh(navigationQuery, { source: $locale });

  invoke(syncLivePreview<Site>, {
    query: siteQuery,
    global: 'site',
    docId: (site) => site.id,
    apply: (_, doc) => doc as unknown as Site,
  });

  return {
    viewModel: { site: siteQuery.$data, sections: navigationQuery.$data },
    siteQuery,
    navigationQuery,
  };
});
