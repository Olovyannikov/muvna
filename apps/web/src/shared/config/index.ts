const isServer = import.meta.env.SSR;

/** Переменные окружения Node — только на сервере (в клиентском бандле ветка вырезается). */
export const serverEnv = (key: string): string | undefined =>
  isServer
    ? (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env[key]
    : undefined;

/** Сайт открыт из админки (Live Preview / «Предпросмотр») — показываем черновики. Только в браузере. */
export const isPreview = !isServer && new URLSearchParams(window.location.search).has('preview');

/** Публичный origin сайта: на сервере — из PUBLIC_URL, в браузере — текущий. */
export const siteOrigin: string = isServer
  ? (serverEnv('PUBLIC_URL') ?? 'http://localhost:5173').replace(/\/$/, '')
  : window.location.origin;

/** Origin админки Payload: из него приходят postMessage Live Preview. */
export const cmsOrigin: string = import.meta.env.VITE_CMS_ORIGIN || (isServer ? '' : window.location.origin);

/** Куда ходить за API: в браузере — тот же origin, на сервере — CMS напрямую по внутренней сети. */
export const apiBase: string = isServer
  ? `${(serverEnv('CMS_INTERNAL_URL') ?? 'http://localhost:3000').replace(/\/$/, '')}/api`
  : '/api';

export const siteName = 'MUVNA';
