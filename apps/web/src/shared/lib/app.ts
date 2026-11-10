import { createEvent } from 'effector';

/** Старт приложения (и на сервере, и в браузере до гидратации): общие данные сайта. */
export const appStarted = createEvent();

/** Только браузер, после гидратации: localStorage, postMessage и прочие браузерные источники. */
export const appMounted = createEvent();
