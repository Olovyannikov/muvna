import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';
import { pageBlocks } from '../blocks';
import { slug } from '../fields/slug';
import { pagePath, previewUrl } from '../lib/preview';

/** Страницы-конструкторы: главная (slug `home`), «Сотрудничество», «Контакты», политика… */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Страница собирается из блоков. Slug «home» — главная страница.',
    livePreview: { url: ({ data }) => previewUrl(pagePath(data?.slug)) },
    preview: (data) => previewUrl(pagePath(data?.slug as string)),
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 400 }, schedulePublish: true }, maxPerDoc: 100 },
  fields: [
    { name: 'title', label: 'Заголовок', type: 'text', required: true, localized: true },
    {
      name: 'layout',
      label: 'Блоки',
      type: 'blocks',
      blocks: pageBlocks,
      admin: { initCollapsed: true },
    },
    slug(),
  ],
};
