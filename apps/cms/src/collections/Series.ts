import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';

/** Продуктовая линейка внутри категории: «MUVNA Gravity», «V-series»… с описанием и фото. */
export const Series: CollectionConfig = {
  slug: 'series',
  labels: { singular: 'Серия', plural: 'Серии' },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'category', '_status'],
    description: 'Блок на странице категории: описание линейки и её товары.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 400 } }, maxPerDoc: 50 },
  fields: [
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      localized: true,
      admin: { description: 'Можно оставить пустым' },
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'anchor',
      label: 'Якорь',
      type: 'text',
      admin: { position: 'sidebar', description: 'Для ссылок вида /espresso/temper#click' },
    },
    { name: 'tagline', label: 'Надзаголовок', type: 'text', localized: true },
    { name: 'heading', label: 'Заголовок описания', type: 'text', localized: true },
    { name: 'description', label: 'Описание', type: 'richText', localized: true },
    { name: 'image', label: 'Фото', type: 'upload', relationTo: 'media' },
    {
      name: 'products',
      label: 'Товары',
      type: 'join',
      collection: 'products',
      on: 'series',
      defaultSort: '_order',
    },
  ],
};
