import { createEvent } from 'effector';

/** Старт приложения: вызывается в app-слое через allSettled(appStarted, { scope }). */
export const appStarted = createEvent();
