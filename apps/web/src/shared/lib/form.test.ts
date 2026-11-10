import { invoke } from '@withease/factories';
import { allSettled, createWatch, fork } from 'effector';
import { describe, expect, it, vi } from 'vitest';

import { createForm, rules, validators } from './form';

const form = invoke(createForm<{ phone: string; email: string }>, {
  initial: { phone: '', email: '' },
  validate: rules({ phone: [validators.required, validators.phone], email: [validators.email] }),
});

describe('createForm', () => {
  it('hides errors until the first submit and blocks invalid data', async () => {
    const scope = fork();
    const listener = vi.fn();
    createWatch({ unit: form.validSubmitted, fn: listener, scope });

    expect(scope.getState(form.$errors)).toEqual({});
    await allSettled(form.submitted, { scope });
    expect(scope.getState(form.$errors)).toEqual({ phone: 'required' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('emits validSubmitted with values once valid', async () => {
    const scope = fork();
    const listener = vi.fn();
    createWatch({ unit: form.validSubmitted, fn: listener, scope });

    await allSettled(form.fieldChanged, { scope, params: { name: 'phone', value: '+7 953 150-15-20' } });
    await allSettled(form.fieldChanged, { scope, params: { name: 'email', value: 'bad' } });
    await allSettled(form.submitted, { scope });
    expect(scope.getState(form.$errors)).toEqual({ email: 'email' });

    await allSettled(form.fieldChanged, { scope, params: { name: 'email', value: 'info@elcanto.ru' } });
    await allSettled(form.submitted, { scope });
    expect(listener).toHaveBeenCalledWith({ phone: '+7 953 150-15-20', email: 'info@elcanto.ru' });
  });
});
