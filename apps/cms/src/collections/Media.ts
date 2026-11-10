import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиатека' },
  admin: { group: 'Контент' },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  folders: true,
  fields: [{ name: 'alt', label: 'Альтернативный текст', type: 'text', localized: true }],
  upload: {
    // В Docker это примонтированный volume, локально — apps/cms/media.
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Оригинал: не больше 2560 px по длинной стороне, webp высокого качества.
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 88 } },
    // Ступени для srcset: браузер сам выбирает подходящую под ширину экрана и DPR.
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'md', width: 1440, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 84 } } },
    ],
  },
};
