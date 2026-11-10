import { createI18nextIntegration } from '@withease/i18next';
import { attach, createEffect, createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import i18next from 'i18next';

import { en } from './locales/en';
import { ru } from './locales/ru';

export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

/** Язык определяется URL (/en/... — английский). Шлёт роутинг; UI переключает язык через навигацию. */
export const localeChanged = createEvent<Locale>();

/** Текущий язык интерфейса и контента — от него зависят все запросы к CMS. sid — для SSR. */
export const $locale = createStore<Locale>(defaultLocale, { sid: 'muvna/i18n/$locale' }).on(
  localeChanged,
  (_, locale) => locale,
);

/** Инициализация i18next: на сервере перед рендером, в браузере — до гидратации. */
export const i18nStarted = createEvent();

const createInstanceFx = attach({
  source: $locale,
  effect: async (lng: Locale) => {
    const instance = i18next.createInstance();
    await instance.init({
      lng,
      fallbackLng: defaultLocale,
      resources: { ru: { translation: ru }, en: { translation: en } },
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    return instance;
  },
});

export const i18n = createI18nextIntegration({ instance: createInstanceFx, setup: i18nStarted });

export const $t = i18n.$t;

sample({ clock: $locale.updates, target: i18n.changeLanguageFx });

const syncHtmlLangFx = createEffect((locale: Locale) => {
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
});
sample({ clock: $locale.updates, target: syncHtmlLangFx });

/** t() текущего скоупа для компонентов. */
export const useT = () => useUnit($t);

export type { Dictionary } from './locales/ru';
