import clsx from 'clsx';

import { AddToCartButton } from '@/features/add-to-cart';

import { ProductCard, ProductGrid, productHref } from '@/entities/product';

import type {
  CategoryTilesBlock,
  LeadFormBlock,
  Page,
  Product,
  ProductGridBlock,
  RichTextBlock,
  SplitMediaBlock,
  StatementBlock,
} from '@/shared/api';
import {
  AppLink,
  ArrowIcon,
  ButtonLink,
  Container,
  Image,
  RichText,
  SectionHeading,
  type LexicalState,
} from '@/shared/ui';

import styles from './blocks.module.css';
import { Hero } from './Hero';
import { LeadForm } from './LeadForm';

const Statement = ({ block }: { block: StatementBlock }) => (
  <section className={clsx(styles.section, styles[`theme-${block.theme ?? 'light'}`])}>
    <Container narrow className={styles.statement}>
      <SectionHeading eyebrow={block.eyebrow} title={block.title} align="center" />
      <RichText value={block.text as LexicalState} size="large" className={styles.statementText} />
    </Container>
  </section>
);

const SplitMedia = ({ block }: { block: SplitMediaBlock }) => (
  <section
    className={clsx(
      styles.split,
      styles[`theme-${block.theme ?? 'light'}`],
      block.imagePosition === 'right' && styles.splitReverse,
    )}
  >
    <div className={styles.splitMedia}>
      <Image media={block.image} size="hero" sizes="(min-width: 1024px) 50vw, 100vw" />
    </div>
    <div className={styles.splitBody}>
      <SectionHeading eyebrow={block.eyebrow} title={block.title} />
      <RichText value={block.text as LexicalState} />
      {block.link?.url && block.link.label && (
        <ButtonLink href={block.link.url} variant={block.theme === 'dark' ? 'accent' : 'primary'}>
          {block.link.label}
        </ButtonLink>
      )}
    </div>
  </section>
);

const RichTextSection = ({ block }: { block: RichTextBlock }) => (
  <section className={styles.section}>
    <Container narrow={block.width !== 'wide'}>
      {block.title && <h2 className={styles.richTitle}>{block.title}</h2>}
      <RichText value={block.content as LexicalState} />
    </Container>
  </section>
);

const ProductGridSection = ({ block }: { block: ProductGridBlock }) => {
  const products = (block.products ?? []).filter((item): item is Product => typeof item === 'object');
  if (!products.length) return null;
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.sectionHead}>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} />
          {block.link?.url && block.link.label && (
            <AppLink href={block.link.url} className={styles.more}>
              {block.link.label} <ArrowIcon size={18} />
            </AppLink>
          )}
        </div>
        <ProductGrid>
          {products.map((product) => {
            const href = productHref(product);
            return (
              <ProductCard
                key={product.id}
                product={product}
                href={href}
                action={<AddToCartButton product={product} href={href} />}
              />
            );
          })}
        </ProductGrid>
      </Container>
    </section>
  );
};

const CategoryTiles = ({ block }: { block: CategoryTilesBlock }) => (
  <section className={styles.section}>
    <Container>
      <SectionHeading eyebrow={block.eyebrow} title={block.title} className={styles.sectionHeadSingle} />
      <ul role="list" className={styles.tiles}>
        {block.tiles?.map((tile) => (
          <li key={tile.id ?? tile.url}>
            <AppLink href={tile.url} className={styles.tile}>
              <Image media={tile.image} size="card" ratio="4 / 5" sizes="(min-width: 1024px) 25vw, 50vw" />
              <span className={styles.tileTitle}>
                {tile.title} <ArrowIcon size={18} />
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

const LeadFormSection = ({ block }: { block: LeadFormBlock }) => (
  <section className={clsx(styles.section, styles['theme-sand'])}>
    <Container className={styles.lead}>
      <div>
        <SectionHeading title={block.title} />
        <RichText value={block.text as LexicalState} />
      </div>
      <LeadForm submitLabel={block.submitLabel} successMessage={block.successMessage} />
    </Container>
  </section>
);

type Block = NonNullable<Page['layout']>[number];

export const PageBlocks = ({ blocks }: { blocks: Page['layout'] }) => (
  <>
    {blocks?.map((block: Block, index) => {
      const key = block.id ?? `${block.blockType}-${index}`;
      switch (block.blockType) {
        case 'hero':
          return <Hero key={key} block={block} first={index === 0} />;
        case 'statement':
          return <Statement key={key} block={block} />;
        case 'splitMedia':
          return <SplitMedia key={key} block={block} />;
        case 'richText':
          return <RichTextSection key={key} block={block} />;
        case 'productGrid':
          return <ProductGridSection key={key} block={block} />;
        case 'categoryTiles':
          return <CategoryTiles key={key} block={block} />;
        case 'leadForm':
          return <LeadFormSection key={key} block={block} />;
        default:
          return null;
      }
    })}
  </>
);
