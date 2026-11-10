import { list } from '@effector/reflect';

import { CartModel, QuantityControl, type CartItem } from '@/entities/cart';

import { useT } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib';
import { AppLink, CloseIcon } from '@/shared/ui';

import styles from './CartDrawer.module.css';

interface Props {
  item: CartItem;
  onQuantityChange: (change: { productId: number; quantity: number }) => void;
  onRemoveClick: (productId: number) => void;
}

const CartLine = ({ item, onQuantityChange, onRemoveClick }: Props) => {
  const t = useT();
  return (
    <li className={styles.line}>
      <AppLink href={item.href} className={styles.thumb}>
        {item.image && <img src={item.image} alt="" loading="lazy" />}
      </AppLink>
      <div className={styles.lineBody}>
        <AppLink href={item.href} className={styles.lineTitle}>
          {item.title}
        </AppLink>
        {item.sku && <p className={styles.lineMeta}>{t('product.sku', { sku: item.sku })}</p>}
        <div className={styles.lineFooter}>
          <QuantityControl
            value={item.quantity}
            label={item.title}
            onChange={(quantity) => onQuantityChange({ productId: item.productId, quantity })}
          />
          <p className={styles.linePrice}>{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
      <button
        type="button"
        className={styles.remove}
        onClick={() => onRemoveClick(item.productId)}
        aria-label={t('cart.remove')}
      >
        <CloseIcon size={16} />
      </button>
    </li>
  );
};

const Lines = list({
  source: CartModel.viewModel.items,
  view: CartLine,
  bind: {
    onQuantityChange: CartModel.viewModel.onQuantityChange,
    onRemoveClick: CartModel.viewModel.onRemoveClick,
  },
  mapItem: { item: (item) => item },
  getKey: (item) => item.productId,
});

/** Позиции корзины — общие для выезжающей панели и страницы /cart. */
export const CartLines = () => (
  <ul role="list" className={styles.lines}>
    <Lines />
  </ul>
);
