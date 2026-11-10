import type { GroupField } from 'payload';

/** Кнопка/ссылка: внутренний путь сайта или внешний URL. */
export const link = (name = 'link', label = 'Кнопка'): GroupField => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', label: 'Текст', type: 'text', localized: true, admin: { width: '40%' } },
        {
          name: 'url',
          label: 'Ссылка',
          type: 'text',
          admin: { width: '60%', description: 'Путь на сайте (/espresso/temper) или полный URL' },
        },
      ],
    },
  ],
});
