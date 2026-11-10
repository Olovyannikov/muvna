import { createRequestFx } from 'effector-refetch';

import { payloadRequest } from '@/shared/api';

export interface LeadInput {
  name?: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  page?: string;
}

export const createLeadFx = createRequestFx<LeadInput, { id: number }>(async (body, { signal }) => {
  const { doc } = await payloadRequest<{ doc: { id: number } }>('/leads', { method: 'POST', body, signal });
  return doc;
});
