import type { ReactNode } from 'react';

import type { Product } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib';
import { AppLink, Image } from '@/shared/ui';

import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  href: string;
  /** Слот для действия (кнопка «В корзину» из features). */
  action?: ReactNode;
}

export const ProductCard = ({ product, href, action }: Props) => {
  const t = useT();
  return (
    <article className={styles.card}>
      <AppLink href={href} className={styles.media} aria-label={product.title}>
        <Image
          media={product.image}
          size="card"
          ratio="1 / 1"
          fit="contain"
          sizes="(min-width: 1200px) 25vw, (min-width: 700px) 33vw, 50vw"
        />
        {product.badge && <span className={styles.badge}>{t(`product.badge.${product.badge}`)}</span>}
        {product.inStock === false && <span className={styles.badge}>{t('product.outOfStock')}</span>}
      </AppLink>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <AppLink href={href}>{product.title}</AppLink>
        </h3>
        {(product.materials || product.sku) && (
          <p className={styles.meta}>
            {[product.sku && t('product.sku', { sku: product.sku }), product.materials]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <div className={styles.footer}>
          <p className={styles.price}>
            {formatPrice(product.price)}
            {product.oldPrice ? <s className={styles.oldPrice}>{formatPrice(product.oldPrice)}</s> : null}
          </p>
          {action}
        </div>
      </div>
    </article>
  );
};
