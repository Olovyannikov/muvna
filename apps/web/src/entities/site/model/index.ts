import { invoke } from '@withease/factories';
import { sample } from 'effector';
import { createQuery } from 'effector-refetch';

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
  // name — стабильные sid для SSR; кэш — чтобы после гидратации не перезапрашивать.
  const cache = { staleAfter: 5 * 60_000 };
  const siteQuery = createQuery({ name: 'site', effect: fetchSiteFx, retry: 2, cache, ...localized });
  const navigationQuery = createQuery({
    name: 'navigation',
    effect: fetchNavigationFx,
    retry: 2,
    cache,
    ...localized,
  });

  // keepFresh пропускает запросы без параметров ($params === undefined), поэтому при смене
  // языка перезапрашиваем явно.
  sample({ clock: $locale.updates, target: [siteQuery.refresh, navigationQuery.refresh] });

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
