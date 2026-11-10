import type { GlobalConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { previewUrl } from '../lib/preview';

/** Общие настройки: шапка, подвал, контакты, соцсети. */
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Настройки сайта',
  admin: { group: 'Контент', livePreview: { url: () => previewUrl('/') } },
  access: { read: anyone, update: authenticated },
  versions: { drafts: { autosave: { interval: 400 } }, max: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Шапка',
          fields: [
            {
              name: 'navLinks',
              label: 'Ссылки в шапке',
              type: 'array',
              admin: { description: 'Меню каталога строится автоматически из разделов и категорий' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Текст', type: 'text', required: true, localized: true },
                    { name: 'url', label: 'Ссылка', type: 'text', required: true },
                  ],
                },
              ],
            },
            { name: 'announcement', label: 'Строка объявления над шапкой', type: 'text', localized: true },
          ],
        },
        {
          label: 'Контакты',
          fields: [
            { name: 'companyName', label: 'Компания', type: 'text', localized: true },
            { name: 'about', label: 'О компании', type: 'textarea', localized: true },
            { name: 'address', label: 'Адрес', type: 'text', localized: true },
            {
              type: 'row',
              fields: [
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Телефон', type: 'text' },
              ],
            },
            { name: 'clientService', label: 'Клиентский отдел', type: 'textarea', localized: true },
            {
              name: 'socials',
              label: 'Соцсети',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'network',
                      label: 'Сеть',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Telegram', value: 'telegram' },
                        { label: 'ВКонтакте', value: 'vk' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Другое', value: 'other' },
                      ],
                    },
                    { name: 'url', label: 'Ссылка', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Подвал',
          fields: [
            {
              name: 'footerLinks',
              label: 'Ссылки в подвале',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Текст', type: 'text', required: true, localized: true },
                    { name: 'url', label: 'Ссылка', type: 'text', required: true },
                  ],
                },
              ],
            },
            { name: 'copyright', label: 'Копирайт', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
};
