import { createEffect } from 'effector';

import { siteName } from '../config';

export interface DocumentMeta {
  title?: string | null;
  description?: string | null;
}

const setMetaTag = (name: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.append(tag);
  }
  tag.content = content;
};

/** Обновляет <title> и description при смене страницы. */
export const setDocumentMetaFx = createEffect(({ title, description }: DocumentMeta) => {
  document.title = title ? (title.includes(siteName) ? title : `${title} — ${siteName}`) : siteName;
  if (description) setMetaTag('description', description);
});
