import clsx from 'clsx';
import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { useT } from '../../i18n';
import type { ValidationError } from '../../lib/form';
import styles from './Field.module.css';

interface BaseProps {
  label: string;
  error?: ValidationError | null;
  className?: string;
}

export const TextField = ({
  label,
  error,
  className,
  required,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) => {
  const id = useId();
  const t = useT();
  return (
    <div className={clsx(styles.field, error && styles.invalid, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        className={styles.control}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error}>
          {t(`validation.${error}`)}
        </span>
      )}
    </div>
  );
};

export const TextAreaField = ({
  label,
  error,
  className,
  required,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const id = useId();
  const t = useT();
  return (
    <div className={clsx(styles.field, error && styles.invalid, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={id}
        className={clsx(styles.control, styles.textarea)}
        required={required}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <span className={styles.error}>{t(`validation.${error}`)}</span>}
    </div>
  );
};
