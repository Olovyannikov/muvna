import { invoke } from '@withease/factories';
import { createStore } from 'effector';
import { createAction } from 'effector-action';
import { createMutation } from 'effector-refetch';

import { CartModel } from '@/entities/cart';

import { createForm, createModel, rules, validators } from '@/shared/lib';

import { createOrderFx } from '../api';

export type CheckoutValues = {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
};

export const CheckoutModel = createModel(() => {
  const form = invoke(createForm<CheckoutValues>, {
    initial: { customerName: '', phone: '', email: '', city: '', address: '', comment: '' },
    validate: rules({
      customerName: [validators.required],
      phone: [validators.required, validators.phone],
      email: [validators.email],
    }),
  });

  const placeOrder = createMutation({ effect: createOrderFx });

  const $placedOrder = createStore<{ id: number; total: number } | null>(null).on(
    placeOrder.finished.done,
    (_, { result }) => ({ id: result.id, total: result.total ?? 0 }),
  );

  /** Сообщение сервера (например, «товар больше недоступен») или null — тогда UI покажет общий текст. */
  const $submitError = createStore<{ message: string | null } | null>(null)
    .on(placeOrder.finished.fail, (_, { error }) => ({ message: (error as Error).message || null }))
    .reset(placeOrder.start);

  createAction(form.validSubmitted, {
    source: { items: CartModel.$items },
    target: { placeOrder: placeOrder.start },
    fn: (target, { items }, values) => {
      if (!items.length) return;
      // На сервер уходят только id и количество — цены Payload пересчитывает сам.
      target.placeOrder({
        ...values,
        email: values.email || undefined,
        items: items.map((item) => ({ product: item.productId, quantity: item.quantity })),
      });
    },
  });

  createAction(placeOrder.finished.done, {
    target: { clearCart: CartModel.cleared, resetForm: form.reset },
    fn: (target) => {
      target.clearCart();
      target.resetForm();
    },
  });

  return {
    viewModel: {
      values: form.$values,
      errors: form.$errors,
      pending: placeOrder.$pending,
      submitError: $submitError,
      onFieldChange: form.fieldChanged,
      onSubmit: form.submitted,
    },
    $placedOrder,
  };
});
