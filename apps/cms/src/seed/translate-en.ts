/**
 * Заливает английскую локаль из ./data/en/*.json поверх существующего контента.
 * Незаполненные поля остаются пустыми — для них Payload отдаёт русский (fallback).
 *
 *   pnpm --filter @muvna/cms seed:en
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPayload } from 'payload';

import config from '../payload.config';
import { fromHtml, fromParagraphs } from './lexical';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'en');
const read = <T>(file: string): T | null =>
  existsSync(path.join(dir, file)) ? (JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as T) : null;

type Paragraphs = string[] | undefined;
type Block = Record<string, unknown> & {
  slides?: Record<string, unknown>[];
  tiles?: Record<string, unknown>[];
  link?: Record<string, unknown>;
};
interface EnBlock {
  eyebrow?: string;
  title?: string;
  text?: Paragraphs;
  content?: Paragraphs;
  link?: string;
  submitLabel?: string;
  successMessage?: string;
  slides?: { eyebrow?: string; title?: string; text?: string; link?: string }[];
  tiles?: string[];
}
interface Structure {
  sections: Record<string, string>;
  categories: Record<string, { title: string; subtitle: string }>;
  site: {
    navLinks: string[];
    footerLinks: string[];
    companyName: string;
    about: string;
    address: string;
    clientService: string;
    copyright: string;
  };
  pages: Record<
    string,
    { title: string; meta?: { title?: string; description?: string }; layout?: EnBlock[] }
  >;
}

const rich = (paragraphs: Paragraphs) => (paragraphs ? (fromParagraphs(paragraphs) as never) : null);

/** Копия блока с английскими значениями локализуемых полей; неуказанные — пустые (fallback на ru). */
const translateBlock = (block: Block, en: EnBlock = {}): Block => ({
  ...block,
  eyebrow: en.eyebrow ?? null,
  title: en.title ?? null,
  ...('text' in block ? { text: rich(en.text) } : {}),
  ...('content' in block ? { content: rich(en.content) } : {}),
  ...('submitLabel' in block ? { submitLabel: en.submitLabel ?? null } : {}),
  ...('successMessage' in block ? { successMessage: en.successMessage ?? null } : {}),
  ...(block.link ? { link: { ...block.link, label: en.link ?? null } } : {}),
  ...(block.slides
    ? {
        slides: block.slides.map((slide, index) => {
          const enSlide = en.slides?.[index] ?? {};
          const link = slide.link as Record<string, unknown> | undefined;
          return {
            ...slide,
            eyebrow: enSlide.eyebrow ?? null,
            title: enSlide.title ?? slide.title,
            text: enSlide.text ?? null,
            ...(link ? { link: { ...link, label: enSlide.link ?? null } } : {}),
          };
        }),
      }
    : {}),
  ...(block.tiles
    ? { tiles: block.tiles.map((tile, index) => ({ ...tile, title: en.tiles?.[index] ?? tile.title })) }
    : {}),
});

const log = (message: string) => console.log(`[en] ${message}`);
const published = { _status: 'published' as const };

const run = async () => {
  const payload = await getPayload({ config });
  const structure = read<Structure>('structure.json');

  if (structure) {
    for (const [id, title] of Object.entries(structure.sections)) {
      await payload.update({ collection: 'sections', id: Number(id), locale: 'en', data: { title } });
    }
    for (const [id, { title, subtitle }] of Object.entries(structure.categories)) {
      const capitalized = title.charAt(0).toUpperCase() + title.slice(1);
      await payload.update({
        collection: 'categories',
        id: Number(id),
        locale: 'en',
        draft: false,
        data: {
          ...published,
          title,
          hero: { title: 'MUVNA', subtitle },
          meta: {
            title: `${capitalized} — MUVNA coffee tools`,
            description: `MUVNA ${title}: precise coffee tools so every cup is perfect.`,
          },
        },
      });
    }
    log('разделы и категории');

    const site = await payload.findGlobal({ slug: 'site', depth: 0, locale: 'ru' });
    await payload.updateGlobal({
      slug: 'site',
      locale: 'en',
      draft: false,
      data: {
        ...published,
        navLinks: (site.navLinks ?? []).map((link, index) => ({
          ...link,
          label: structure.site.navLinks[index] ?? link.label,
        })),
        footerLinks: (site.footerLinks ?? []).map((link, index) => ({
          ...link,
          label: structure.site.footerLinks[index] ?? link.label,
        })),
        companyName: structure.site.companyName,
        about: structure.site.about,
        address: structure.site.address,
        clientService: structure.site.clientService,
        copyright: structure.site.copyright,
      },
    });
    log('настройки сайта');

    for (const [slug, en] of Object.entries(structure.pages)) {
      const { docs } = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        depth: 0,
        locale: 'ru',
        limit: 1,
      });
      const page = docs[0];
      if (!page) continue;
      await payload.update({
        collection: 'pages',
        id: page.id,
        locale: 'en',
        draft: false,
        data: {
          ...published,
          title: en.title,
          ...(en.meta ? { meta: { ...page.meta, ...en.meta } } : {}),
          // Без английской раскладки (политика) копируем русские блоки: обязательные поля
          // валидируются в каждой локали, а показывать всё равно нужно тот же текст.
          layout: (en.layout
            ? (page.layout ?? []).map((block, index) =>
                translateBlock(block as unknown as Block, en.layout?.[index]),
              )
            : page.layout) as never,
        },
      });
    }
    log('страницы');
  }

  const series = read<
    {
      id: number;
      title: string | null;
      tagline: string | null;
      heading: string | null;
      description: string[];
    }[]
  >('series.json');
  for (const item of series ?? []) {
    await payload.update({
      collection: 'series',
      id: item.id,
      locale: 'en',
      draft: false,
      data: {
        ...published,
        title: item.title,
        tagline: item.tagline,
        heading: item.heading,
        description: rich(item.description),
      },
    });
  }
  if (series) log(`серии: ${series.length}`);

  const products = read<{ id: number; title: string; materials: string | null }[]>('products.json');
  for (const item of products ?? []) {
    await payload.update({
      collection: 'products',
      id: item.id,
      locale: 'en',
      draft: false,
      data: { ...published, title: item.title, materials: item.materials },
    });
  }
  if (products) log(`товары: ${products.length}`);

  // Подробные описания: HTML с переводом (те же теги, что у русского) → rich text.
  const details = read<{ id: number; html: string }[]>('product-details.json');
  for (const item of details ?? []) {
    await payload.update({
      collection: 'products',
      id: item.id,
      locale: 'en',
      draft: false,
      data: { ...published, details: fromHtml(item.html) as never },
    });
  }
  if (details) log(`описания товаров: ${details.length}`);

  log('готово ✓');
  process.exit(0);
};

await run();
