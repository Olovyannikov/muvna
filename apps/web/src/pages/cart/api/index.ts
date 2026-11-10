import { createRequestFx } from 'effector-refetch';

import { payloadRequest, type Order } from '@/shared/api';

export interface OrderInput {
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  comment?: string;
  items: { product: number; quantity: number }[];
}

export const createOrderFx = createRequestFx<OrderInput, Order>(async (body, { signal }) => {
  const { doc } = await payloadRequest<{ doc: Order }>('/orders', { method: 'POST', body, signal });
  return doc;
});
