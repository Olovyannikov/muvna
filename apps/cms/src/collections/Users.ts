import type { CollectionConfig } from 'payload';

import { authenticated } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  admin: { useAsTitle: 'email', group: 'Система' },
  auth: true,
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [{ name: 'name', label: 'Имя', type: 'text' }],
};
