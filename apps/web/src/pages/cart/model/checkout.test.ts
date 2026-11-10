import { allSettled, fork } from 'effector';
import { describe, expect, it, vi } from 'vitest';

import { CartModel } from '@/entities/cart';

import { createOrderFx } from '../api';
import { CheckoutModel } from './checkout';

const { $items } = CartModel;
const { $placedOrder } = CheckoutModel;
const { onFieldChange, onSubmit } = CheckoutModel.viewModel;

describe('checkout', () => {
  it('sends only product ids and quantities, then clears the cart', async () => {
    const handler = vi.fn(async () => ({ id: 42, total: 10800 }));
    const scope = fork({
      values: [[$items, [{ productId: 7, title: 'Темпер', price: 1, href: '/x', quantity: 2 }]]],
      handlers: [[createOrderFx, handler]],
    });

    await allSettled(onFieldChange, { scope, params: { name: 'customerName', value: 'Илья' } });
    await allSettled(onFieldChange, { scope, params: { name: 'phone', value: '+79531501520' } });
    await allSettled(onSubmit, { scope });

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: 'Илья',
        phone: '+79531501520',
        items: [{ product: 7, quantity: 2 }],
      }),
    );
    expect(scope.getState($placedOrder)).toEqual({ id: 42, total: 10800 });
    expect(scope.getState($items)).toEqual([]);
  });

  it('does not submit an invalid form', async () => {
    const handler = vi.fn();
    const scope = fork({ handlers: [[createOrderFx, handler]] });
    await allSettled(onSubmit, { scope });
    expect(handler).not.toHaveBeenCalled();
  });
});
