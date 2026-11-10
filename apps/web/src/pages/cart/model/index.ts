import { combine, sample } from 'effector';

import { CartModel } from '@/entities/cart';

import { $t } from '@/shared/i18n';
import { createModel, setDocumentMetaFx } from '@/shared/lib';
import { routes } from '@/shared/routing';

import { CheckoutModel } from './checkout';

export const CartPageModel = createModel(() => {
  sample({
    clock: routes.cart.opened,
    source: $t,
    fn: (t) => ({ title: t('cart.title') }),
    target: setDocumentMetaFx,
  });

  // Экран «спасибо за заказ» показываем, пока пользователь не ушёл со страницы.
  CheckoutModel.$placedOrder.reset(routes.cart.closed);

  const $state = combine(CheckoutModel.$placedOrder, CartModel.$isEmpty, (placed, empty) =>
    placed ? ('placed' as const) : empty ? ('empty' as const) : ('cart' as const),
  );

  return {
    viewModel: { state: $state, total: CartModel.$total, placedOrder: CheckoutModel.$placedOrder },
  };
});
