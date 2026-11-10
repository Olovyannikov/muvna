import { combine, createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

import { appStarted, createModel } from '@/shared/lib';
import { router } from '@/shared/routing';

export const MAX_QUANTITY = 99;

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  href: string;
  image?: string;
  sku?: string | null;
  quantity: number;
}

const clamp = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity) || 1));

export const CartModel = createModel(() => {
  const itemAdded = createEvent<Omit<CartItem, 'quantity'> & { quantity?: number }>();
  const quantityChanged = createEvent<{ productId: number; quantity: number }>();
  const itemRemoved = createEvent<number>();
  const cleared = createEvent();

  const drawerOpened = createEvent();
  const drawerClosed = createEvent();

  const $items = createStore<CartItem[]>([])
    .on(itemAdded, (items, { quantity = 1, ...item }) => {
      const existing = items.find((entry) => entry.productId === item.productId);
      return existing
        ? items.map((entry) =>
            entry.productId === item.productId
              ? { ...entry, ...item, quantity: clamp(entry.quantity + quantity) }
              : entry,
          )
        : [...items, { ...item, quantity: clamp(quantity) }];
    })
    .on(quantityChanged, (items, { productId, quantity }) =>
      quantity < 1
        ? items.filter((entry) => entry.productId !== productId)
        : items.map((entry) =>
            entry.productId === productId ? { ...entry, quantity: clamp(quantity) } : entry,
          ),
    )
    .on(itemRemoved, (items, productId) => items.filter((entry) => entry.productId !== productId))
    .reset(cleared);

  const $count = $items.map((items) => items.reduce((sum, item) => sum + item.quantity, 0));
  const $total = $items.map((items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const $isEmpty = $items.map((items) => items.length === 0);
  const $summary = combine({ count: $count, total: $total });

  const $isDrawerOpen = createStore(false)
    .on(drawerOpened, () => true)
    .on(drawerClosed, () => false);

  // Добавили товар — показываем корзину сбоку; ушли на другую страницу — прячем.
  sample({ clock: itemAdded, target: drawerOpened });
  sample({ clock: router.updated, target: drawerClosed });

  // pickup: значение из localStorage читается в том скоупе, где стартовало приложение.
  persist({ store: $items, key: 'muvna:cart', pickup: appStarted });

  return {
    viewModel: {
      items: $items,
      count: $count,
      total: $total,
      isEmpty: $isEmpty,
      isDrawerOpen: $isDrawerOpen,
      onQuantityChange: quantityChanged,
      onRemoveClick: itemRemoved,
      onCartOpen: drawerOpened,
      onCartClose: drawerClosed,
    },
    itemAdded,
    quantityChanged,
    itemRemoved,
    cleared,
    drawerOpened,
    drawerClosed,
    $items,
    $count,
    $total,
    $isEmpty,
    $summary,
    $isDrawerOpen,
  };
});
