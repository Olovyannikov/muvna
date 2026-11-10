import type { CollectionConfig } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';
import { slug } from '../fields/slug';
import { productPath } from '../lib/paths';
import { previewUrl } from '../lib/preview';

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Товар', plural: 'Товары' },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'sku', 'price', 'category', '_status'],
    listSearchableFields: ['title', 'sku'],
    livePreview: { url: async ({ data, req }) => previewUrl(await productPath(data, req.payload)) },
    preview: async (data, { req }) => previewUrl(await productPath(data, req.payload)),
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
      type: 'row',
      fields: [
        { name: 'price', label: 'Цена, ₽', type: 'number', required: true, min: 0 },
        { name: 'oldPrice', label: 'Старая цена, ₽', type: 'number', min: 0 },
        { name: 'sku', label: 'Артикул', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'inStock', label: 'В наличии', type: 'checkbox', defaultValue: true },
        {
          name: 'badge',
          label: 'Метка',
          type: 'select',
          options: [
            { label: 'Новинка', value: 'new' },
            { label: 'Хит', value: 'hit' },
            { label: 'Скидка', value: 'sale' },
          ],
        },
      ],
    },
    { name: 'materials', label: 'Материалы', type: 'text', localized: true },
    { name: 'note', label: 'Краткое описание', type: 'textarea', localized: true },
    { name: 'image', label: 'Главное фото', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'array',
      fields: [{ name: 'image', label: 'Фото', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'details', label: 'Подробное описание', type: 'richText', localized: true },
    {
      name: 'specs',
      label: 'Характеристики',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Параметр', type: 'text', required: true, localized: true },
            { name: 'value', label: 'Значение', type: 'text', required: true, localized: true },
          ],
        },
      ],
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
      name: 'series',
      label: 'Серия',
      type: 'relationship',
      relationTo: 'series',
      admin: { position: 'sidebar' },
      filterOptions: ({ data }) => (data?.category ? { category: { equals: data.category } } : true),
    },
    slug(),
  ],
};
