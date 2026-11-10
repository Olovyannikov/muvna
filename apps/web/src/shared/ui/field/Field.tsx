import { Textarea, TextInput, type TextareaProps, type TextInputProps } from '@mantine/core';

import { useT } from '../../i18n';
import type { ValidationError } from '../../lib/form';

interface BaseProps {
  label: string;
  /** Ключ словаря `validation.*` — переводится здесь. */
  error?: ValidationError | null;
}

export const TextField = ({ error, ...props }: BaseProps & Omit<TextInputProps, 'error' | 'label'>) => {
  const t = useT();
  return <TextInput error={error ? t(`validation.${error}`) : undefined} {...props} />;
};

export const TextAreaField = ({ error, ...props }: BaseProps & Omit<TextareaProps, 'error' | 'label'>) => {
  const t = useT();
  return <Textarea autosize minRows={3} error={error ? t(`validation.${error}`) : undefined} {...props} />;
};
