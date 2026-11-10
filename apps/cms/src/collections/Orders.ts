import type { CollectionConfig } from 'payload';

import { anyone, authenticated, authenticatedField } from '../access';
import { priceOrder } from '../hooks/priceOrder';

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Заказ', plural: 'Заказы' },
  admin: {
    useAsTitle: 'customerName',
    group: 'Продажи',
    defaultColumns: ['customerName', 'phone', 'total', 'status', 'createdAt'],
  },
  // Гость может только создать заказ; читать и менять — менеджеры.
  access: { create: anyone, read: authenticated, update: authenticated, delete: authenticated },
  hooks: { beforeValidate: [priceOrder] },
  fields: [
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'В работе', value: 'processing' },
        { label: 'Отправлен', value: 'shipped' },
        { label: 'Выполнен', value: 'done' },
        { label: 'Отменён', value: 'cancelled' },
      ],
      access: { update: authenticatedField },
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'customerName', label: 'Имя', type: 'text', required: true, maxLength: 120 },
        { name: 'phone', label: 'Телефон', type: 'text', required: true, maxLength: 40 },
        { name: 'email', label: 'Email', type: 'email' },
      ],
    },
    { name: 'city', label: 'Город', type: 'text', maxLength: 120 },
    { name: 'address', label: 'Адрес доставки', type: 'textarea', maxLength: 500 },
    { name: 'comment', label: 'Комментарий', type: 'textarea', maxLength: 2000 },
    {
      name: 'items',
      label: 'Позиции',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 100,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', label: 'Товар', type: 'relationship', relationTo: 'products', required: true },
            { name: 'quantity', label: 'Кол-во', type: 'number', required: true, min: 1 },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Название', type: 'text' },
            { name: 'sku', label: 'Артикул', type: 'text' },
            { name: 'price', label: 'Цена, ₽', type: 'number' },
          ],
        },
      ],
    },
    { name: 'total', label: 'Сумма, ₽', type: 'number', admin: { position: 'sidebar', readOnly: true } },
  ],
};
