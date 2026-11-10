import { reflect, variant } from '@effector/reflect';

import { CartLines } from '@/widgets/cart-drawer';

import { useT } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib';
import { ButtonLink, Container, ErrorState } from '@/shared/ui';

import { CartPageModel } from '../model';
import styles from './CartPage.module.css';
import { CheckoutForm } from './CheckoutForm';

const ThankYou = ({ order }: { order: { id: number; total: number } | null }) => {
  const t = useT();
  if (!order) return null;
  return (
    <ErrorState
      code="✓"
      title={t('checkout.successTitle')}
      text={t('checkout.successText', { id: String(order.id), total: formatPrice(order.total) })}
    >
      <ButtonLink href="/">{t('errors.toHome')}</ButtonLink>
    </ErrorState>
  );
};

const EmptyCart = () => {
  const t = useT();
  return (
    <ErrorState title={t('cart.empty')} text={t('cart.emptyHint')}>
      <ButtonLink href="/">{t('cart.toCatalog')}</ButtonLink>
    </ErrorState>
  );
};

const CartWithCheckout = ({ total }: { total: number }) => {
  const t = useT();
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

export const CartPage = variant({
  source: CartPageModel.viewModel.state,
  cases: {
    placed: reflect({ view: ThankYou, bind: { order: CartPageModel.viewModel.placedOrder } }),
    empty: EmptyCart,
    cart: reflect({ view: CartWithCheckout, bind: { total: CartPageModel.viewModel.total } }),
  },
});
