import { reflect } from '@effector/reflect';
import type { FormEvent } from 'react';

import { useT } from '@/shared/i18n';
import type { Errors } from '@/shared/lib';
import { Button, TextAreaField, TextField } from '@/shared/ui';

import { LeadFormModel, type LeadValues } from '../model';
import styles from './LeadForm.module.css';

interface Props {
  submitLabel?: string | null;
  successMessage?: string | null;
  values: LeadValues;
  errors: Errors<LeadValues>;
  pending: boolean;
  isSent: boolean;
  submitFailed: boolean;
  onFieldChange: (change: { name: keyof LeadValues; value: string }) => void;
  onSubmit: () => void;
}

const LeadFormView = ({
  submitLabel,
  successMessage,
  values,
  errors,
  pending,
  isSent,
  submitFailed,
  onFieldChange,
  onSubmit,
}: Props) => {
  const t = useT();

  if (isSent) {
    return (
      <p className={styles.success} role="status">
        {successMessage || t('lead.success')}
      </p>
    );
  }

  const bind = (name: keyof LeadValues) => ({
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
      <TextField label={t('lead.name')} autoComplete="name" {...bind('name')} />
      <TextField label={t('lead.company')} autoComplete="organization" {...bind('company')} />
      <TextField
        label={t('lead.phone')}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        {...bind('phone')}
      />
      <TextField label={t('lead.email')} type="email" autoComplete="email" required {...bind('email')} />
      <TextAreaField label={t('lead.message')} rows={3} className={styles.wide} {...bind('message')} />
      {submitFailed && (
        <p className={styles.error} role="alert">
          {t('lead.error')}
        </p>
      )}
      <div className={styles.wide}>
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? t('lead.sending') : submitLabel || t('lead.submit')}
        </Button>
      </div>
    </form>
  );
};

export const LeadForm = reflect({ view: LeadFormView, bind: LeadFormModel.viewModel });
