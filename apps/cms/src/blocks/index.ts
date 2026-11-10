import type { Block } from 'payload';

import { link } from '../fields/link';

const theme = {
  name: 'theme',
  label: 'Тема',
  type: 'select' as const,
  defaultValue: 'light',
  options: [
    { label: 'Светлая', value: 'light' },
    { label: 'Тёмная', value: 'dark' },
    { label: 'Песочная', value: 'sand' },
  ],
};

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Первый экран', plural: 'Первые экраны' },
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'slides',
      label: 'Слайды',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
        { name: 'title', label: 'Заголовок', type: 'text', required: true, localized: true },
        { name: 'text', label: 'Текст', type: 'textarea', localized: true },
        { name: 'image', label: 'Фон', type: 'upload', relationTo: 'media', required: true },
        link(),
      ],
    },
  ],
};

export const StatementBlock: Block = {
  slug: 'statement',
  labels: { singular: 'Манифест', plural: 'Манифесты' },
  interfaceName: 'StatementBlock',
  fields: [
    { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
    { name: 'title', label: 'Заголовок', type: 'text', localized: true },
    { name: 'text', label: 'Текст', type: 'richText', localized: true },
    theme,
  ],
};

export const SplitMediaBlock: Block = {
  slug: 'splitMedia',
  labels: { singular: 'Фото + текст', plural: 'Фото + текст' },
  interfaceName: 'SplitMediaBlock',
  fields: [
    { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
    { name: 'title', label: 'Заголовок', type: 'text', required: true, localized: true },
    { name: 'text', label: 'Текст', type: 'richText', localized: true },
    { name: 'image', label: 'Фото', type: 'upload', relationTo: 'media', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          label: 'Фото',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Слева', value: 'left' },
            { label: 'Справа', value: 'right' },
          ],
        },
        theme,
      ],
    },
    link(),
  ],
};

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Текст', plural: 'Тексты' },
  interfaceName: 'RichTextBlock',
  fields: [
    { name: 'title', label: 'Заголовок', type: 'text', localized: true },
    { name: 'content', label: 'Содержимое', type: 'richText', required: true, localized: true },
    {
      name: 'width',
      label: 'Ширина',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Узкая (для чтения)', value: 'narrow' },
        { label: 'Широкая', value: 'wide' },
      ],
    },
  ],
};

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: { singular: 'Подборка товаров', plural: 'Подборки товаров' },
  interfaceName: 'ProductGridBlock',
  fields: [
    { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
    { name: 'title', label: 'Заголовок', type: 'text', localized: true },
    { name: 'products', label: 'Товары', type: 'relationship', relationTo: 'products', hasMany: true },
    link(),
  ],
};

export const CategoryTilesBlock: Block = {
  slug: 'categoryTiles',
  labels: { singular: 'Плитки категорий', plural: 'Плитки категорий' },
  interfaceName: 'CategoryTilesBlock',
  fields: [
    { name: 'eyebrow', label: 'Надзаголовок', type: 'text', localized: true },
    { name: 'title', label: 'Заголовок', type: 'text', localized: true },
    {
      name: 'tiles',
      label: 'Плитки',
      type: 'array',
      fields: [
        { name: 'title', label: 'Название', type: 'text', required: true, localized: true },
        { name: 'image', label: 'Фото', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', label: 'Ссылка', type: 'text', required: true },
      ],
    },
  ],
};

export const LeadFormBlock: Block = {
  slug: 'leadForm',
  labels: { singular: 'Форма заявки', plural: 'Формы заявки' },
  interfaceName: 'LeadFormBlock',
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      defaultValue: 'Получить оптовый прайс',
      localized: true,
    },
    { name: 'text', label: 'Текст', type: 'richText', localized: true },
    {
      name: 'submitLabel',
      label: 'Текст кнопки',
      type: 'text',
      defaultValue: 'Отправить запрос',
      localized: true,
    },
    {
      name: 'successMessage',
      label: 'Сообщение после отправки',
      type: 'text',
      defaultValue: 'Спасибо! Мы свяжемся с вами.',
      localized: true,
    },
  ],
};

export const pageBlocks = [
  HeroBlock,
  StatementBlock,
  SplitMediaBlock,
  RichTextBlock,
  ProductGridBlock,
  CategoryTilesBlock,
  LeadFormBlock,
];
