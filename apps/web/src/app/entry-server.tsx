import { allSettled, fork, serialize } from 'effector';
import { $queryCache, dehydrate, inMemoryCache } from 'effector-refetch';
import { createMemoryHistory } from 'history';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { siteOrigin } from '@/shared/config';
import { $locale, i18nStarted, localeChanged } from '@/shared/i18n';
import { $meta, appStarted } from '@/shared/lib';
import { historyAttached, localeOf, stripLocale } from '@/shared/routing';

import { App } from './App';
import { renderHead } from './head';

import './model';

export interface RenderResult {
  html: string;
  head: string;
  /** Скрипт с состоянием скоупа и кэшем запросов для гидратации. */
  state: string;
  locale: string;
  status: number;
}

/** Рендер страницы на сервере: свой скоуп и свой кэш запросов на каждый запрос. */
export async function render(url: string): Promise<RenderResult> {
  const cache = inMemoryCache();
  const scope = fork({ values: [[$queryCache, cache]] });
  const history = createMemoryHistory({ initialEntries: [url] });

  // Язык и переводы → маршрут и его данные → общие данные сайта (allSettled ждёт все запросы).
  await allSettled(localeChanged, { scope, params: localeOf(history.location.pathname) });
  await allSettled(i18nStarted, { scope });
  await allSettled(historyAttached, { scope, params: history });
  await allSettled(appStarted, { scope });

  const html = renderToString(
    <StrictMode>
      <App scope={scope} />
    </StrictMode>,
  );

  const locale = scope.getState($locale);
  const payload = JSON.stringify({ values: serialize(scope), cache: dehydrate(cache) }).replace(
    /</g,
    '\\u003c',
  );

  return {
    html,
    head: renderHead({
      meta: scope.getState($meta),
      path: stripLocale(history.location.pathname),
      locale,
      origin: siteOrigin,
    }),
    state: `<script>window.__MUVNA__=${payload}</script>`,
    locale,
    status: html.includes('data-http-status="404"') ? 404 : 200,
  };
}
