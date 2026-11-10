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
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 2048, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
  },
};
