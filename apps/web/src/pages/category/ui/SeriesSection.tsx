import clsx from 'clsx';

import { AddToCartButton } from '@/features/add-to-cart';

import { ProductCard, ProductGrid } from '@/entities/product';

import { useT } from '@/shared/i18n';
import { Container, Image, isRichTextEmpty, RichText, type LexicalState } from '@/shared/ui';

import type { SeriesGroup } from '../api';
import styles from './SeriesSection.module.css';

interface Props {
  group: SeriesGroup;
  index: number;
  /** /espresso/temper — к нему добавляется slug товара. */
  basePath: string;
}

export const SeriesSection = ({ group, index, basePath }: Props) => {
  const t = useT();
  const { series, products } = group;
  const description = series?.description as LexicalState | null | undefined;
  const hasStory = Boolean(series?.image || series?.heading || !isRichTextEmpty(description));

  return (
    <section
      className={styles.section}
      id={series?.anchor && series.anchor !== 'click' ? series.anchor : undefined}
    >
      <Container>
        <header className={styles.head}>
          {series?.tagline && <p className={styles.tagline}>{series.tagline}</p>}
          <h2 className={styles.title}>{series ? series.title : t('category.other')}</h2>
          {products.length > 0 && (
            <p className={styles.count}>{t('category.products', { count: products.length })}</p>
          )}
        </header>

        {hasStory && (
          <div
            className={clsx(
              styles.story,
              index % 2 === 1 && styles.storyReverse,
              !series?.image && styles.storyTextOnly,
            )}
          >
            {series?.image && (
              <div className={styles.storyMedia}>
                <Image media={series.image} size="hero" sizes="(min-width: 1024px) 60vw, 100vw" />
              </div>
            )}
            <div className={styles.storyBody}>
              {series?.heading && <h3 className={styles.heading}>{series.heading}</h3>}
              <RichText value={description} />
            </div>
          </div>
        )}

        {products.length > 0 && (
          <ProductGrid>
            {products.map((product) => {
              const href = `${basePath}/${product.slug}`;
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
        )}
      </Container>
    </section>
  );
};
