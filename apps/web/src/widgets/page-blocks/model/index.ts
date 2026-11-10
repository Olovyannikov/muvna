import { invoke } from '@withease/factories';
import { createStore, sample } from 'effector';
import { createMutation } from 'effector-refetch';

import { createForm, createModel, rules, validators } from '@/shared/lib';
import { router } from '@/shared/routing';

import { createLeadFx } from '../api';

export type LeadValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
};

export const LeadFormModel = createModel(() => {
  const form = invoke(createForm<LeadValues>, {
    initial: { name: '', company: '', phone: '', email: '', message: '' },
    validate: rules({
      phone: [validators.required, validators.phone],
      email: [validators.required, validators.email],
    }),
  });

  const sendLead = createMutation({ effect: createLeadFx });

  const $isSent = createStore(false)
    .on(sendLead.finished.done, () => true)
    .reset(router.updated);

  const $submitFailed = createStore(false)
    .on(sendLead.finished.fail, () => true)
    .reset(sendLead.start);

  sample({
    clock: form.validSubmitted,
    source: router.$path,
    fn: (path, values) => ({ ...values, page: path ?? undefined }),
    target: sendLead.start,
  });

  sample({ clock: [sendLead.finished.done, router.updated], target: form.reset });

  return {
    viewModel: {
      values: form.$values,
      errors: form.$errors,
      pending: sendLead.$pending,
      isSent: $isSent,
      submitFailed: $submitFailed,
      onFieldChange: form.fieldChanged,
      onSubmit: form.submitted,
    },
  };
});
