import { createFactory } from '@withease/factories';
import { combine, createEvent, createStore, sample, type Event } from 'effector';

type Values = Record<string, string>;
export type Errors<T extends Values> = Partial<Record<keyof T, ValidationError>>;

interface FormConfig<T extends Values> {
  initial: T;
  validate: (values: T) => Errors<T>;
}

/**
 * Простая форма на effector: значения, валидация, ошибки показываются после первой отправки.
 * `validSubmitted` срабатывает только для валидных данных.
 *
 * Фабрика: вызывать через `invoke(createForm<Values>, config)`.
 */
export const createForm = createFactory(<T extends Values>({ initial, validate }: FormConfig<T>) => {
  const fieldChanged = createEvent<{ name: keyof T; value: string }>();
  const submitted = createEvent();
  const reset = createEvent();

  const $values = createStore<T>(initial)
    .on(fieldChanged, (values, { name, value }) => ({ ...values, [name]: value }))
    .reset(reset);
  const $touched = createStore(false)
    .on(submitted, () => true)
    .reset(reset);
  const $errors = $values.map(validate);
  const $isValid = $errors.map((errors) => Object.keys(errors).length === 0);
  const $visibleErrors = combine($errors, $touched, (errors, touched): Errors<T> => (touched ? errors : {}));

  const validSubmitted: Event<T> = sample({ clock: submitted, source: $values, filter: $isValid });

  return { fieldChanged, submitted, reset, $values, $errors: $visibleErrors, $isValid, validSubmitted };
});

/** Ошибки — ключи словаря `validation.*`, переводятся в UI. */
export type ValidationError = 'required' | 'phone' | 'email';

export const validators = {
  required: (value: string): ValidationError | null => (value.trim() ? null : 'required'),
  phone: (value: string): ValidationError | null => (value.replace(/\D/g, '').length >= 10 ? null : 'phone'),
  email: (value: string): ValidationError | null =>
    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'email',
};

/** Собирает первые ошибки по полям: rules({ phone: [validators.required, validators.phone] }) */
export const rules =
  <T extends Values>(schema: Partial<Record<keyof T, ((value: string) => ValidationError | null)[]>>) =>
  (values: T): Errors<T> =>
    Object.fromEntries(
      Object.entries(schema)
        .map(([name, checks]) => [
          name,
          (checks ?? []).map((check) => check(values[name] ?? '')).find(Boolean),
        ])
        .filter(([, error]) => Boolean(error)),
    ) as Errors<T>;
