import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { slug } from '../fields/slug';

/** Верхний уровень меню каталога: «Приготовление эспрессо», «Альтернативное заваривание»… */
export const Sections: CollectionConfig = {
  slug: 'sections',
  labels: { singular: 'Раздел', plural: 'Разделы каталога' },
  orderable: true,
  admin: { useAsTitle: 'title', group: 'Каталог', defaultColumns: ['title', 'slug'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true, localized: true },
    { name: 'image', label: 'Обложка в меню', type: 'upload', relationTo: 'media' },
    {
      name: 'categories',
      label: 'Категории',
      type: 'join',
      collection: 'categories',
      on: 'section',
      defaultSort: '_order',
    },
    slug(),
  ],
};
