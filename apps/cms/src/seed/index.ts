/**
 * Наполняет CMS контентом со старого muvna.ru (данные в ./data, картинки качаются с muvna.ru).
 *   pnpm seed               — на пустую базу
 *   SEED_FORCE=1 pnpm seed  — удалить каталог/страницы и залить заново
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPayload, type Payload } from 'payload';

import { slugify } from '../lib/slugify';
import config from '../payload.config';
import { fromHtml, fromParagraphs, heading, list, paragraph, root, text } from './lexical';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(dirname, 'data', file), 'utf8')) as T;

interface RawProduct {
  title: string;
  sku: string | null;
  materials: string | null;
  note: string | null;
  price: number;
  image: string;
  details: string | null;
  detailsHtml: string | null;
  gallery?: string[];
}
interface RawSeries {
  anchor: string | null;
  title: string | null;
  tagline: string | null;
  heading: string | null;
  description: string[];
  image: string | null;
  gallery?: string[];
  caption?: string | null;
  products: RawProduct[];
}
interface RawCategory {
  slug: string;
  title: string;
  meta?: { title?: string; description?: string };
  hero: { title: string; subtitle: string; image: string };
  series: RawSeries[];
}
interface Catalog {
  sections: { slug: string; title: string; categories: RawCategory[] }[];
}
interface Block {
  title: string;
  paragraphs: string[];
  image: string | null;
  link?: string;
}
interface Pages {
  site: {
    footer: {
      about: { text: string };
      address: string;
      email: string;
      phone: string;
      clientDepartment: { text: string };
      socials: { network: 'vk' | 'telegram'; url: string }[];
    };
  };
  pages: {
    home: {
      hero: { title: string; subtitle: string; image: string };
      story: Block;
      spirit: Block;
      products: Block & { subtitle: string; items: Block[] };
    };
    cooperation: { title: string; blocks: Block[]; spirit: Block; hero: { image: string } };
    contact: { company: Block; form: { title: string; submitLabel: string } };
    privacy: {
      title: string;
      blocks: {
        type: 'heading' | 'paragraph' | 'list';
        level?: number;
        text?: string;
        items?: string[];
        ordered?: boolean;
      }[];
    };
  };
}

const log = (message: string) => console.log(`[seed] ${message}`);

/** Загрузка картинок со старого сайта: одна картинка — один документ media. */
const createMediaLoader = (payload: Payload) => {
  const cache = new Map<string, Promise<number | null>>();
  let active = 0;
  const queue: (() => void)[] = [];
  const limit = async <T>(task: () => Promise<T>) => {
    if (active >= 6) await new Promise<void>((resolve) => queue.push(resolve));
    active += 1;
    try {
      return await task();
    } finally {
      active -= 1;
      queue.shift()?.();
    }
  };

  return (url: string | null | undefined, alt: string): Promise<number | null> => {
    if (!url || url.endsWith('.ico')) return Promise.resolve(null);
    if (!cache.has(url)) {
      cache.set(
        url,
        limit(async () => {
          for (let attempt = 1; attempt <= 3; attempt += 1) {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              const data = Buffer.from(await response.arrayBuffer());
              const name = url.split('/').pop() ?? 'image.png';
              const doc = await payload.create({
                collection: 'media',
                data: { alt },
                file: {
                  data,
                  name,
                  size: data.length,
                  mimetype: response.headers.get('content-type') ?? 'image/png',
                },
              });
              return doc.id;
            } catch (error) {
              if (attempt === 3) {
                log(`⚠ не удалось загрузить ${url}: ${(error as Error).message}`);
                return null;
              }
            }
          }
          return null;
        }),
      );
    }
    return cache.get(url)!;
  };
};

const published = { _status: 'published' as const };

const run = async () => {
  const payload = await getPayload({ config });
  const catalog = read<Catalog>('catalog.json');
  const { site, pages } = read<Pages>('pages.json');
  const media = createMediaLoader(payload);

  const existing = await payload.count({ collection: 'products' });
  if (existing.totalDocs > 0) {
    if (!process.env.SEED_FORCE) {
      log('в базе уже есть товары — пропускаю. SEED_FORCE=1 чтобы залить заново.');
      process.exit(0);
    }
    for (const collection of ['products', 'series', 'categories', 'sections', 'pages', 'media'] as const) {
      await payload.delete({ collection, where: { id: { exists: true } } });
    }
    log('старые данные удалены');
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } });
    if (!totalDocs) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Администратор' } });
      log(`создан администратор ${email}`);
    }
  }

  // ——— Каталог
  const usedSlugs = new Set<string>();
  const uniqueSlug = (base: string, ...fallbacks: (string | null | undefined)[]) => {
    for (const candidate of [
      base,
      ...fallbacks.filter(Boolean).map((suffix) => `${base}-${slugify(suffix!)}`),
    ]) {
      if (!usedSlugs.has(candidate)) {
        usedSlugs.add(candidate);
        return candidate;
      }
    }
    let index = 2;
    while (usedSlugs.has(`${base}-${index}`)) index += 1;
    usedSlugs.add(`${base}-${index}`);
    return `${base}-${index}`;
  };

  const productsByCategory = new Map<string, { id: number; image: number | null }[]>();
  const categoryImages = new Map<string, number | null>();

  for (const rawSection of catalog.sections) {
    const section = await payload.create({
      collection: 'sections',
      data: { title: rawSection.title, slug: rawSection.slug },
    });
    log(`раздел «${section.title}»`);

    for (const rawCategory of rawSection.categories) {
      const heroImage = await media(rawCategory.hero.image, rawCategory.title);
      const category = await payload.create({
        collection: 'categories',
        draft: false,
        data: {
          ...published,
          title: rawCategory.title,
          slug: rawCategory.slug,
          section: section.id,
          hero: { title: rawCategory.hero.title, subtitle: rawCategory.hero.subtitle, image: heroImage },
          meta: { title: rawCategory.meta?.title, description: rawCategory.meta?.description },
        },
      });
      const created: { id: number; image: number | null }[] = [];

      for (const rawSeries of rawCategory.series) {
        const seriesImage = await media(
          rawSeries.image ?? rawSeries.gallery?.[0],
          rawSeries.title ?? rawCategory.title,
        );
        if (seriesImage && !categoryImages.has(rawCategory.slug))
          categoryImages.set(rawCategory.slug, seriesImage);
        const series = await payload.create({
          collection: 'series',
          draft: false,
          data: {
            ...published,
            title: rawSeries.title,
            anchor: rawSeries.anchor,
            tagline: rawSeries.tagline,
            heading: rawSeries.heading,
            description: fromParagraphs([...rawSeries.description, rawSeries.caption]) as never,
            image: seriesImage,
            category: category.id,
          },
        });

        const products = await Promise.all(
          rawSeries.products.map(async (raw) => {
            const image = await media(raw.image, raw.title);
            const gallery = (
              await Promise.all(
                (raw.gallery ?? []).filter((url) => url !== raw.image).map((url) => media(url, raw.title)),
              )
            ).filter((id): id is number => id !== null);
            return { raw, image, gallery };
          }),
        );

        for (const { raw, image, gallery } of products) {
          if (!image) continue;
          const doc = await payload.create({
            collection: 'products',
            draft: false,
            data: {
              ...published,
              title: raw.title,
              slug: uniqueSlug(slugify(raw.title), raw.sku, rawCategory.slug),
              price: raw.price,
              sku: raw.sku,
              materials: raw.materials,
              image,
              gallery: gallery.map((id) => ({ image: id })),
              details: (raw.detailsHtml
                ? fromHtml(raw.detailsHtml)
                : raw.details
                  ? fromParagraphs(raw.details.split('\n\n'))
                  : null) as never,
              category: category.id,
              series: series.id,
              inStock: true,
            },
          });
          created.push({ id: doc.id, image });
        }
      }

      productsByCategory.set(rawCategory.slug, created);
      if (!categoryImages.has(rawCategory.slug))
        categoryImages.set(rawCategory.slug, created[0]?.image ?? heroImage);
      log(`  категория «${category.title}»: ${created.length} товаров`);
    }
  }

  // ——— Настройки сайта
  const { footer } = site;
  await payload.updateGlobal({
    slug: 'site',
    draft: false,
    data: {
      ...published,
      navLinks: [
        { label: 'Сотрудничество', url: '/cooperation' },
        { label: 'Контакты', url: '/contact' },
      ],
      companyName: 'Эльканто',
      about: footer.about.text,
      address: footer.address,
      email: footer.email,
      phone: footer.phone,
      clientService: footer.clientDepartment.text,
      socials: footer.socials.map(({ network, url }) => ({ network, url })),
      footerLinks: [{ label: 'Политика конфиденциальности', url: '/privacy' }],
      copyright: `© ${new Date().getFullYear()} Эльканто · MUVNA`,
    },
  });
  log('настройки сайта');

  // ——— Страницы
  const { home, cooperation, contact, privacy } = pages;
  const categoryHref = (sectionSlug: string, categorySlug: string) => `/${sectionSlug}/${categorySlug}`;
  const findCategory = (slug: string) => {
    for (const section of catalog.sections) {
      const category = section.categories.find((item) => item.slug === slug);
      if (category) return { section, category };
    }
    throw new Error(`нет категории ${slug}`);
  };

  const slides = [
    {
      eyebrow: '#muvnacoffeetools',
      title: 'Инструменты для идеальной чашки',
      text: home.hero.subtitle,
      image: home.hero.image,
      link: { label: 'Смотреть каталог', url: '/espresso/temper' },
    },
    ...(['dripper', 'smart'] as const).map((slug) => {
      const { section, category } = findCategory(slug);
      return {
        eyebrow: section.title,
        title: category.title.charAt(0).toUpperCase() + category.title.slice(1),
        text: category.hero.subtitle.charAt(0).toUpperCase() + category.hero.subtitle.slice(1),
        image: category.hero.image,
        link: { label: 'Перейти', url: categoryHref(section.slug, slug) },
      };
    }),
  ];

  // Ссылки промо-блоков со старого сайта; «CLICK» вёл на несуществующий /espresso#click.
  const fixLink = (url?: string) =>
    url?.includes('#click') ? '/espresso/temper' : url?.replace('https://muvna.ru', '') || '/';

  const tiles = ['temper', 'basket', 'portafilter', 'pitcher', 'dripper', 'grinders', 'smart', 'cup'].map(
    (slug) => {
      const { section, category } = findCategory(slug);
      return {
        title: category.title.charAt(0).toUpperCase() + category.title.slice(1),
        image: categoryImages.get(slug),
        url: categoryHref(section.slug, slug),
      };
    },
  );

  const featured = [
    'temper',
    'smart',
    'basket',
    'portafilter',
    'pitcher',
    'dripper',
    'distributor',
    'grinders',
  ]
    .map((slug) => productsByCategory.get(slug)?.[0]?.id)
    .filter((id): id is number => Boolean(id));

  await payload.create({
    collection: 'pages',
    draft: false,
    data: {
      ...published,
      title: 'Главная',
      slug: 'home',
      meta: {
        title: 'MUVNA — инновационные кофейные инструменты',
        description:
          'Темперы, умные весы, прецизионные корзины, портафильтры и аксессуары для альтернативного заваривания.',
      },
      layout: [
        {
          blockType: 'hero',
          slides: await Promise.all(
            slides.map(async (slide) => ({ ...slide, image: (await media(slide.image, slide.title))! })),
          ),
        },
        {
          blockType: 'statement',
          eyebrow: home.story.title,
          title: 'Команда, которая живёт кофе',
          text: fromParagraphs(home.story.paragraphs) as never,
          theme: 'light',
        },
        {
          blockType: 'categoryTiles',
          eyebrow: 'Каталог',
          title: 'Инструменты для каждого этапа',
          tiles: tiles.filter((tile) => tile.image) as never,
        },
        ...(await Promise.all(
          home.products.items.map(async (item, index) => ({
            blockType: 'splitMedia' as const,
            eyebrow: index === 0 ? home.products.title : undefined,
            title:
              item.title.charAt(0) +
              item.title.slice(1).toLowerCase().replace(/muvna/g, 'MUVNA').replace(/click/g, 'CLICK'),
            text: fromParagraphs(item.paragraphs) as never,
            image: (await media(item.image, item.title))!,
            imagePosition: index % 2 ? ('right' as const) : ('left' as const),
            theme: index % 2 ? ('sand' as const) : ('light' as const),
            link: { label: 'Подробнее', url: fixLink(item.link) },
          })),
        )),
        {
          blockType: 'productGrid',
          eyebrow: 'Выбор бариста',
          title: 'Популярное',
          products: featured,
          link: { label: 'Весь каталог', url: '/espresso/temper' },
        },
        {
          blockType: 'statement',
          eyebrow: home.spirit.title,
          title: 'От продукта к совершенству',
          text: fromParagraphs(home.spirit.paragraphs) as never,
          theme: 'dark',
        },
      ] as never,
    },
  });

  await payload.create({
    collection: 'pages',
    draft: false,
    data: {
      ...published,
      title: cooperation.title,
      slug: 'cooperation',
      layout: [
        {
          blockType: 'hero',
          slides: [
            {
              eyebrow: 'MUVNA',
              title: cooperation.title,
              text: 'Открыты к диалогу с кофейным сообществом и партнёрами в регионах',
              image: (await media(cooperation.hero.image, cooperation.title))!,
            },
          ],
        },
        ...(await Promise.all(
          cooperation.blocks.map(async (block, index) => ({
            blockType: 'splitMedia' as const,
            title: block.title,
            text: fromParagraphs(block.paragraphs) as never,
            image: (await media(block.image, block.title))!,
            imagePosition: index % 2 ? ('right' as const) : ('left' as const),
            theme: 'light' as const,
            link: { label: 'Написать нам', url: 'mailto:info@elcanto.ru' },
          })),
        )),
        {
          blockType: 'statement',
          eyebrow: cooperation.spirit.title,
          text: fromParagraphs(cooperation.spirit.paragraphs) as never,
          theme: 'dark',
        },
      ] as never,
    },
  });

  await payload.create({
    collection: 'pages',
    draft: false,
    data: {
      ...published,
      title: 'Контакты',
      slug: 'contact',
      layout: [
        {
          blockType: 'richText',
          title: contact.company.title,
          content: fromParagraphs(contact.company.paragraphs) as never,
          width: 'narrow',
        },
        {
          blockType: 'leadForm',
          title: contact.form.title,
          submitLabel: contact.form.submitLabel,
          text: fromParagraphs([
            'Оставьте контакты — пришлём актуальный оптовый прайс и условия сотрудничества.',
          ]) as never,
        },
      ] as never,
    },
  });

  await payload.create({
    collection: 'pages',
    draft: false,
    data: {
      ...published,
      title: privacy.title,
      slug: 'privacy',
      layout: [
        {
          blockType: 'richText',
          width: 'narrow',
          content: root(
            privacy.blocks
              .slice(privacy.blocks[0]?.type === 'heading' ? 1 : 0)
              .map((block) =>
                block.type === 'heading'
                  ? heading(block.text ?? '', 'h2')
                  : block.type === 'list'
                    ? list(block.items ?? [], block.ordered)
                    : paragraph([text(block.text ?? '')]),
              ),
          ) as never,
        },
      ] as never,
    },
  });
  log('страницы: главная, сотрудничество, контакты, политика');

  log('готово ✓');
  process.exit(0);
};

await run();
