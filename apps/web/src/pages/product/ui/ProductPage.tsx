import clsx from 'clsx';

import { AddToCartButton } from '@/features/add-to-cart';

import { QuantityControl } from '@/entities/cart';
import { productCategory, productSection } from '@/entities/product';

import type { Media, Product } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { formatPrice, useViewModel } from '@/shared/lib';
import { AppLink, Container, Image, QueryBoundary, RichText, type LexicalState } from '@/shared/ui';

import { ProductModel } from '../model';
import styles from './ProductPage.module.css';

const imagesOf = (product: Product): (number | Media)[] => [
  product.image,
  ...(product.gallery ?? []).map((item) => item.image).filter((image) => image !== product.image),
];

const Gallery = ({ product }: { product: Product }) => {
  const { activeImage: active, onImageSelect } = useViewModel(ProductModel);
  const images = imagesOf(product);
  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          media={images[active] ?? images[0]}
          size="hero"
          ratio="1 / 1"
          fit="contain"
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      </div>
      {images.length > 1 && (
        <ul role="list" className={styles.thumbs}>
          {images.map((image, index) => (
            <li key={typeof image === 'object' ? image.id : image}>
              <button
                type="button"
                className={clsx(styles.thumb, index === active && styles.thumbActive)}
                onClick={() => onImageSelect(index)}
                aria-label={`${index + 1} / ${images.length}`}
                aria-pressed={index === active}
              >
                <Image media={image} size="thumb" ratio="1 / 1" fit="contain" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProductDetails = ({ product, href }: { product: Product; href: string }) => {
  const t = useT();
  const { quantity, onQuantityChange } = useViewModel(ProductModel);
  const category = productCategory(product);
  const section = productSection(product);
  const series = typeof product.series === 'object' ? product.series : null;

  return (
    <div className={styles.info}>
      <nav className={styles.crumbs} aria-label="breadcrumbs">
        {section && <span>{section.title}</span>}
        {section && category && (
          <AppLink href={`/${section.slug}/${category.slug}`}>{category.title}</AppLink>
        )}
      </nav>
      {series?.title && <p className={styles.series}>{series.title}</p>}
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.price}>
        {formatPrice(product.price)}
        {product.oldPrice ? <s>{formatPrice(product.oldPrice)}</s> : null}
      </p>
      {product.note && <p className={styles.note}>{product.note}</p>}

      <div className={styles.buy}>
        <QuantityControl value={quantity} label={product.title} onChange={onQuantityChange} />
        <AddToCartButton product={product} href={href} quantity={quantity} size="default" block />
      </div>
      <p className={styles.delivery}>{t('product.delivery')}</p>

      <dl className={styles.facts}>
        {product.sku && (
          <>
            <dt>{t('product.skuFull')}</dt>
            <dd>{product.sku}</dd>
          </>
        )}
        {product.materials && (
          <>
            <dt>{t('product.materials')}</dt>
            <dd>{product.materials}</dd>
          </>
        )}
        {product.specs?.map((spec) => (
          <div key={spec.id ?? spec.name} className={styles.fact}>
            <dt>{spec.name}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
        <dt>{t('product.inStock')}</dt>
        <dd>{product.inStock === false ? '—' : '✓'}</dd>
      </dl>
    </div>
  );
};

export const ProductPage = () => {
  const t = useT();
  const { product: data, error, isLoading, href, onRetryClick } = useViewModel(ProductModel);

  return (
    <QueryBoundary loading={isLoading} error={data ? null : error} onRetry={onRetryClick}>
      {data && (
        <article>
          <Container className={styles.layout}>
            <Gallery product={data} />
            <ProductDetails product={data} href={href} />
          </Container>
          {data.details && (
            <Container narrow className={styles.description}>
              <h2 className={styles.sectionTitle}>{t('product.details')}</h2>
              <RichText value={data.details as LexicalState} />
            </Container>
          )}
        </article>
      )}
    </QueryBoundary>
  );
};
