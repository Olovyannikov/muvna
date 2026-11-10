import { createI18nextIntegration } from '@withease/i18next';
import { attach, createEffect, createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import i18next from 'i18next';

import { appStarted } from '../lib/app';
import { en } from './locales/en';
import { ru } from './locales/ru';

export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

const STORAGE_KEY = 'muvna:lang';

const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);

/** localStorage → язык браузера → ru. */
export const detectLocale = (): Locale => {
  if (typeof window === 'undefined') return 'ru';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // приватный режим — просто не помним выбор
  }
  return navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : navigator.language ? 'en' : 'ru';
};

export const localeSwitched = createEvent<Locale>();

/** Текущий язык интерфейса и контента — от него зависят все запросы к CMS. */
export const $locale = createStore<Locale>('ru').on(localeSwitched, (_, locale) => locale);

const detectLocaleFx = createEffect(detectLocale);
sample({ clock: appStarted, target: detectLocaleFx });
sample({ clock: detectLocaleFx.doneData, target: $locale });

const createInstanceFx = attach({
  source: $locale,
  effect: async (lng: Locale) => {
    const instance = i18next.createInstance();
    await instance.init({
      lng,
      fallbackLng: 'ru',
      resources: { ru: { translation: ru }, en: { translation: en } },
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    return instance;
  },
});

export const i18n = createI18nextIntegration({
  instance: createInstanceFx,
  setup: detectLocaleFx.finally.map(() => undefined),
});

export const $t = i18n.$t;

const rememberLocaleFx = createEffect((locale: Locale) => {
  document.documentElement.lang = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // no-op
  }
});

sample({ clock: localeSwitched, target: i18n.changeLanguageFx });
sample({ clock: $locale, target: rememberLocaleFx });

/** t() текущего скоупа для компонентов. */
export const useT = () => useUnit($t);

export type { Dictionary } from './locales/ru';
