import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';

/** Заявки с форм сайта (оптовый прайс, сотрудничество). */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'email',
    group: 'Продажи',
    defaultColumns: ['name', 'company', 'phone', 'email', 'createdAt'],
  },
  access: { create: anyone, read: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', maxLength: 120 },
    { name: 'company', label: 'Компания', type: 'text', maxLength: 200 },
    { name: 'phone', label: 'Телефон', type: 'text', required: true, maxLength: 40 },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Сообщение', type: 'textarea', maxLength: 2000 },
    { name: 'page', label: 'Страница', type: 'text', maxLength: 200, admin: { readOnly: true } },
    {
      name: 'processed',
      label: 'Обработана',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
};
