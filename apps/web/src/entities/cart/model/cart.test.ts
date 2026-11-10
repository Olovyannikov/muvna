import { allSettled, fork } from 'effector';
import { describe, expect, it } from 'vitest';

import { CartModel, MAX_QUANTITY } from './index';

const { $count, $isDrawerOpen, $items, $total, cleared, itemAdded, itemRemoved, quantityChanged } = CartModel;

const tamper = { productId: 1, title: 'Темпер Click', price: 5400, href: '/espresso/temper/click' };
const scale = { productId: 2, title: 'Весы Psyche', price: 3500, href: '/scale/smart/psyche' };

describe('cart model', () => {
  it('adds items, merges duplicates and computes totals', async () => {
    const scope = fork();
    await allSettled(itemAdded, { scope, params: tamper });
    await allSettled(itemAdded, { scope, params: { ...tamper, quantity: 2 } });
    await allSettled(itemAdded, { scope, params: scale });

    expect(scope.getState($items).map((item) => [item.productId, item.quantity])).toEqual([
      [1, 3],
      [2, 1],
    ]);
    expect(scope.getState($count)).toBe(4);
    expect(scope.getState($total)).toBe(3 * 5400 + 3500);
    expect(scope.getState($isDrawerOpen)).toBe(true);
  });

  it('clamps quantity and removes an item when quantity drops below one', async () => {
    const scope = fork({ values: [[$items, [{ ...tamper, quantity: 1 }]]] });

    await allSettled(quantityChanged, { scope, params: { productId: 1, quantity: 500 } });
    expect(scope.getState($items)[0]?.quantity).toBe(MAX_QUANTITY);

    await allSettled(quantityChanged, { scope, params: { productId: 1, quantity: 0 } });
    expect(scope.getState($items)).toEqual([]);
  });

  it('removes and clears', async () => {
    const scope = fork({
      values: [
        [
          $items,
          [
            { ...tamper, quantity: 1 },
            { ...scale, quantity: 1 },
          ],
        ],
      ],
    });
    await allSettled(itemRemoved, { scope, params: 1 });
    expect(scope.getState($items).map((item) => item.productId)).toEqual([2]);
    await allSettled(cleared, { scope });
    expect(scope.getState($count)).toBe(0);
  });
});
