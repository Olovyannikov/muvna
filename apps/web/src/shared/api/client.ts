import { RequestError } from 'effector-refetch';

import { isPreview } from '../config';
import type { Locale } from '../i18n';

type Primitive = string | number | boolean | null | undefined;
export type QueryValue = Primitive | QueryValue[] | { [key: string]: QueryValue };
export type QueryParams = { [key: string]: QueryValue };

const serialize = (name: string, value: QueryValue): string[] => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.flatMap((item, i) => serialize(`${name}[${i}]`, item));
  if (typeof value === 'object')
    return Object.entries(value).flatMap(([key, item]) => serialize(`${name}[${key}]`, item));
  return [`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`];
};

/** qs-совместимая сериализация: { where: { slug: { equals: 'x' } } } → where[slug][equals]=x */
export const stringifyQuery = (params: QueryParams): string =>
  Object.entries(params)
    .flatMap(([key, value]) => serialize(key, value))
    .join('&');

interface RequestOptions {
  query?: QueryParams;
  /** Язык контента (локализация Payload). */
  locale?: Locale;
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Запрос к REST API Payload. CMS живёт на том же домене (/api), поэтому
 * cookie редактора уходит сама — в превью видны черновики.
 */
export const payloadRequest = async <T>(
  path: string,
  { query, locale, method = 'GET', body, signal }: RequestOptions = {},
) => {
  const search = stringifyQuery({
    ...query,
    locale,
    ...(isPreview && method === 'GET' ? { draft: true } : {}),
  });
  const response = await fetch(`/api${path}${search ? `?${search}` : ''}`, {
    method,
    signal,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (data as { errors?: { message?: string }[] } | null)?.errors?.[0]?.message ?? `HTTP ${response.status}`;
    throw new RequestError(message, { status: response.status, data });
  }
  return data as T;
};

export interface PaginatedDocs<T> {
  docs: T[];
  totalDocs: number;
}

export class NotFoundError extends RequestError {
  constructor(what: string) {
    super(`${what} не найдено`, { status: 404 });
  }
}

/** Первый документ коллекции по фильтру или 404. */
export const findOne = async <T>(
  collection: string,
  query: QueryParams,
  { locale, signal }: { locale?: Locale; signal?: AbortSignal } = {},
): Promise<T> => {
  const { docs } = await payloadRequest<PaginatedDocs<T>>(`/${collection}`, {
    query: { limit: 1, ...query },
    locale,
    signal,
  });
  const [doc] = docs;
  if (!doc) throw new NotFoundError(collection);
  return doc;
};
