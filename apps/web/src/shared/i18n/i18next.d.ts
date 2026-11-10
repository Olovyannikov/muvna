import 'i18next';

import type { ru } from './locales/ru';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof ru };
    returnNull: false;
  }
}
