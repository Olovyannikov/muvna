import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { en } from '@payloadcms/translations/languages/en';
import { ru } from '@payloadcms/translations/languages/ru';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Categories } from './collections/Categories';
import { Leads } from './collections/Leads';
import { Media } from './collections/Media';
import { Orders } from './collections/Orders';
import { Pages } from './collections/Pages';
import { Products } from './collections/Products';
import { Sections } from './collections/Sections';
import { Series } from './collections/Series';
import { Users } from './collections/Users';
import { Site } from './globals/Site';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000';
const webURL = process.env.WEB_URL ?? 'http://localhost:5173';
const origins = [...new Set([serverURL, webURL])];

export default buildConfig({
  serverURL,
  cors: origins,
  csrf: origins,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — MUVNA CMS' },
    livePreview: {
      breakpoints: [
        { name: 'mobile', label: 'Телефон', width: 390, height: 844 },
        { name: 'tablet', label: 'Планшет', width: 834, height: 1112 },
        { name: 'desktop', label: 'Десктоп', width: 1440, height: 900 },
      ],
    },
  },
  i18n: { supportedLanguages: { ru, en }, fallbackLanguage: 'ru' },
  // Контент на двух языках; незаполненный английский берётся из русского.
  localization: {
    locales: [
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  collections: [Pages, Sections, Categories, Series, Products, Orders, Leads, Media, Users],
  globals: [Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // В проде схема накатывается миграциями при старте, в dev — push.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'categories', 'products'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => `${(doc as { title?: string }).title ?? ''} — MUVNA`,
    }),
  ],
});
