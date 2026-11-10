import { reflect } from '@effector/reflect';

import { CartModel } from '@/entities/cart';

import { useT } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib';
import { Button, ButtonLink, Drawer } from '@/shared/ui';

import styles from './CartDrawer.module.css';
import { CartLines } from './CartLines';

interface Props {
  open: boolean;
  empty: boolean;
  total: number;
  close: () => void;
}

/** Выезжающая корзина: Mantine Drawer (focus trap, Esc, блокировка скролла) поверх нашей разметки. */
const CartDrawerView = ({ open, empty, total, close }: Props) => {
  const t = useT();
  return (
    <Drawer
      opened={open}
      onClose={close}
      title={t('cart.title')}
      closeButtonProps={{ 'aria-label': t('cart.close') }}
      classNames={{ body: styles.body }}
    >
      {empty ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('cart.empty')}</p>
          <p>{t('cart.emptyHint')}</p>
          <Button variant="outline" onClick={close}>
            {t('cart.continue')}
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.scroll}>
            <CartLines />
          </div>
          <footer className={styles.foot}>
            <p className={styles.total}>
              <span>{t('cart.total')}</span>
              <strong>{formatPrice(total)}</strong>
            </p>
            <p className={styles.note}>{t('cart.note')}</p>
            <ButtonLink href="/cart" block>
              {t('cart.checkout')}
            </ButtonLink>
          </footer>
        </>
      )}
    </Drawer>
  );
};

export const CartDrawer = reflect({
  view: CartDrawerView,
  bind: {
    open: CartModel.viewModel.isDrawerOpen,
    empty: CartModel.viewModel.isEmpty,
    total: CartModel.viewModel.total,
    close: CartModel.viewModel.onCartClose,
  },
});
