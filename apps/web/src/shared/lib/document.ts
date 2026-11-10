import { createEffect, createEvent, createStore, sample } from 'effector';

import { siteName } from '../config';

export interface DocumentMeta {
  title?: string | null;
  description?: string | null;
  /** Абсолютная или корневая ссылка на картинку для Open Graph. */
  image?: string | null;
  type?: 'website' | 'product';
  /** Структурированные данные schema.org (JSON-LD). */
  jsonLd?: Record<string, unknown> | null;
}

/** Страница сообщает свои мета-данные. */
export const metaChanged = createEvent<DocumentMeta>();

/** Мета текущей страницы: сервер пишет их в <head>, браузер синхронизирует document. sid — для SSR. */
export const $meta = createStore<DocumentMeta>({}, { sid: 'muvna/meta' }).on(metaChanged, (_, meta) => meta);

export const formatTitle = (title?: string | null): string =>
  title ? (title.includes(siteName) ? title : `${title} — ${siteName}`) : siteName;

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.append(tag);
  }
  tag.content = content;
};

const syncDocumentFx = createEffect((meta: DocumentMeta) => {
  if (typeof document === 'undefined') return;
  document.title = formatTitle(meta.title);
  if (meta.description) {
    setMetaTag('name', 'description', meta.description);
    setMetaTag('property', 'og:description', meta.description);
  }
  setMetaTag('property', 'og:title', formatTitle(meta.title));
});

sample({ clock: $meta.updates, target: syncDocumentFx });
