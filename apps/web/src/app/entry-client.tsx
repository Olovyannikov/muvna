import { allSettled, fork } from 'effector';
import { $queryCache, hydrate, inMemoryCache, type DehydratedEntry } from 'effector-refetch';
import { createBrowserHistory } from 'history';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { isPreview } from '@/shared/config';
import { i18nStarted, localeChanged } from '@/shared/i18n';
import { appStarted } from '@/shared/lib';
import { historyAttached, localeOf } from '@/shared/routing';

import { App } from './App';

import './model';
import './styles/layers.css';
import '@mantine/core/styles.layer.css';
import '@mantine/carousel/styles.layer.css';
import './styles/global.css';

declare global {
  interface Window {
    __MUVNA__?: { values: Record<string, unknown>; cache: DehydratedEntry[] };
  }
}

const main = async () => {
  // В Live Preview сервер отрендерил опубликованное — черновики клиент запрашивает сам, с нуля.
  const payload = isPreview ? undefined : window.__MUVNA__;

  // Состояние сервера: сторы — через fork({ values }), кэш запросов — чтобы маршрут не перезапрашивал данные.
  const cache = inMemoryCache();
  if (payload) hydrate(cache, payload.cache);
  const scope = fork({ values: payload?.values ?? {} });
  await allSettled($queryCache, { scope, params: cache });

  // До гидратации разметка клиента должна совпасть с серверной: язык, переводы, открытый маршрут,
  // общие данные сайта. Запросы попадают в восстановленный кэш — сети здесь нет.
  const history = createBrowserHistory();
  await allSettled(localeChanged, { scope, params: localeOf(history.location.pathname) });
  await allSettled(i18nStarted, { scope });
  await allSettled(historyAttached, { scope, params: history });
  await allSettled(appStarted, { scope });

  const root = document.getElementById('root');
  if (!root) throw new Error('#root not found');
  const app = (
    <StrictMode>
      <App scope={scope} />
    </StrictMode>
  );
  // Браузерное (корзина из localStorage, Live Preview) стартует из AppGate — после гидратации.
  if (payload) hydrateRoot(root, app);
  else createRoot(root).render(app);
};

void main();
