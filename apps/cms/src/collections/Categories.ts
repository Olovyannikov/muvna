import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';
import { slug } from '../fields/slug';
import { categoryPath } from '../lib/paths';
import { previewUrl } from '../lib/preview';

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'section', 'slug', '_status'],
    livePreview: { url: async ({ data, req }) => previewUrl(await categoryPath(data, req.payload)) },
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 400 } }, maxPerDoc: 50 },
  fields: [
    { name: 'title', label: 'Название', type: 'text', required: true, localized: true },
    {
      name: 'section',
      label: 'Раздел',
      type: 'relationship',
      relationTo: 'sections',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Обложка',
          fields: [
            {
              name: 'hero',
              label: false,
              type: 'group',
              fields: [
                { name: 'title', label: 'Заголовок', type: 'text', defaultValue: 'MUVNA', localized: true },
                { name: 'subtitle', label: 'Подзаголовок', type: 'text', localized: true },
                { name: 'image', label: 'Фон', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Серии и товары',
          fields: [
            {
              name: 'series',
              label: 'Серии',
              type: 'join',
              collection: 'series',
              on: 'category',
              defaultSort: '_order',
            },
          ],
        },
      ],
    },
    slug(),
  ],
};
