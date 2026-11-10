import { createEvent, sample } from 'effector';

import { CartModel, type CartItem } from '@/entities/cart';

import { createModel } from '@/shared/lib';

export const AddToCartModel = createModel(() => {
  const addClicked = createEvent<Omit<CartItem, 'quantity'> & { quantity?: number }>();

  sample({ clock: addClicked, target: CartModel.itemAdded });

  return { viewModel: { onAddClick: addClicked } };
});
