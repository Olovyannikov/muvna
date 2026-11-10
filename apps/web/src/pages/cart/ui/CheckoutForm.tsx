import type { FormEvent } from 'react';

import { useT } from '@/shared/i18n';
import { useViewModel } from '@/shared/lib';
import { AppLink, Button, TextAreaField, TextField } from '@/shared/ui';

import { CheckoutModel, type CheckoutValues } from '../model/checkout';
import styles from './CheckoutForm.module.css';

type Field = keyof CheckoutValues;

export const CheckoutForm = () => {
  const t = useT();
  const { values, errors, pending, submitError, onFieldChange, onSubmit } = useViewModel(CheckoutModel);

  const bind = (name: Field) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: { target: { value: string } }) => onFieldChange({ name, value: event.target.value }),
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>{t('checkout.title')}</h2>
      <p className={styles.hint}>{t('checkout.hint')}</p>
      <div className={styles.grid}>
        <TextField label={t('checkout.name')} autoComplete="name" required {...bind('customerName')} />
        <TextField
          label={t('checkout.phone')}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          {...bind('phone')}
        />
        <TextField label={t('checkout.email')} type="email" autoComplete="email" {...bind('email')} />
        <TextField label={t('checkout.city')} autoComplete="address-level2" {...bind('city')} />
        <TextAreaField
          label={t('checkout.address')}
          autoComplete="street-address"
          rows={2}
          className={styles.wide}
          {...bind('address')}
        />
        <TextAreaField label={t('checkout.comment')} rows={3} className={styles.wide} {...bind('comment')} />
      </div>
      {submitError && (
        <p className={styles.error} role="alert">
          {submitError.message && submitError.message.length < 160
            ? submitError.message
            : t('checkout.error')}
        </p>
      )}
      <Button type="submit" block disabled={pending}>
        {pending ? t('checkout.sending') : t('checkout.submit')}
      </Button>
      <p className={styles.legal}>
        {t('checkout.legalPrefix')} <AppLink href="/privacy">{t('checkout.legalLink')}</AppLink>.
      </p>
    </form>
  );
};
