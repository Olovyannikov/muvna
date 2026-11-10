import { CartLines } from '@/widgets/cart-drawer';

import { useT } from '@/shared/i18n';
import { formatPrice, useViewModel } from '@/shared/lib';
import { ButtonLink, Container, ErrorState } from '@/shared/ui';

import { CartPageModel } from '../model';
import styles from './CartPage.module.css';
import { CheckoutForm } from './CheckoutForm';

export const CartPage = () => {
  const t = useT();
  const { isEmpty: empty, total, placedOrder: placed } = useViewModel(CartPageModel);

  if (placed) {
    return (
      <ErrorState
        code="✓"
        title={t('checkout.successTitle')}
        text={t('checkout.successText', { id: String(placed.id), total: formatPrice(placed.total) })}
      >
        <ButtonLink href="/">{t('errors.toHome')}</ButtonLink>
      </ErrorState>
    );
  }

  if (empty) {
    return (
      <ErrorState title={t('cart.empty')} text={t('cart.emptyHint')}>
        <ButtonLink href="/">{t('cart.toCatalog')}</ButtonLink>
      </ErrorState>
    );
  }

  return (
    <Container className={styles.layout}>
      <section>
        <h1 className={styles.title}>{t('cart.title')}</h1>
        <CartLines />
        <p className={styles.total}>
          <span>{t('cart.total')}</span>
          <strong>{formatPrice(total)}</strong>
        </p>
        <p className={styles.note}>{t('cart.note')}</p>
      </section>
      <aside className={styles.checkout}>
        <CheckoutForm />
      </aside>
    </Container>
  );
};
