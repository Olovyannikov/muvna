import { reflect } from '@effector/reflect';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { CartModel } from '@/entities/cart';

import { useT } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib';
import { Button, ButtonLink, CloseIcon } from '@/shared/ui';

import styles from './CartDrawer.module.css';
import { CartLines } from './CartLines';

interface Props {
  open: boolean;
  empty: boolean;
  total: number;
  close: () => void;
}

const CartDrawerView = ({ open, empty, total, close }: Props) => {
  const t = useT();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <div className={clsx(styles.root, open && styles.open)} aria-hidden={!open} inert={!open}>
      <div className={styles.backdrop} onClick={close} />
      <div
        ref={panel}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        tabIndex={-1}
      >
        <header className={styles.head}>
          <h2 className={styles.title}>{t('cart.title')}</h2>
          <button type="button" className={styles.close} onClick={close} aria-label={t('cart.close')}>
            <CloseIcon />
          </button>
        </header>

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
      </div>
    </div>
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
