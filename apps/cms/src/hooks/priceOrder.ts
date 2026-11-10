import { APIError, type CollectionBeforeValidateHook } from 'payload';

type OrderItemInput = { product?: number | { id: number } | null; quantity?: number | null };

export const MAX_QTY = 99;

/**
 * Пересчитывает позиции заказа по ценам из базы: клиенту доверяем только id товара и количество.
 * Работает только при создании — менеджер потом может править заказ вручную.
 */
export const priceOrder: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data) return data;

  const items = (data.items ?? []) as OrderItemInput[];
  if (items.length === 0) throw new APIError('Корзина пуста', 400, null, true);

  const priced = await Promise.all(
    items.map(async (item) => {
      const id = typeof item.product === 'object' ? item.product?.id : item.product;
      const quantity = Math.min(MAX_QTY, Math.max(1, Math.trunc(Number(item.quantity) || 1)));
      if (!id) throw new APIError('Некорректный товар в заказе', 400, null, true);

      const product = await req.payload
        .findByID({ collection: 'products', id, depth: 0, draft: false, overrideAccess: true })
        .catch(() => null);
      if (!product || product._status !== 'published') {
        throw new APIError('Один из товаров больше недоступен', 400, null, true);
      }

      return { product: product.id, title: product.title, sku: product.sku, price: product.price, quantity };
    }),
  );

  return {
    ...data,
    items: priced,
    total: priced.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'new',
  };
};
