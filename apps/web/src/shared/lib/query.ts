import { combine, createEvent, sample, type EventCallable, type Store } from 'effector';
import { isHttpError } from 'effector-refetch';

/** Сетевые сбои повторяем, а 4xx (например, 404 «нет такой страницы») — нет. */
export const retryTransient = {
  times: 2,
  delay: 400,
  filter: ({ error }: { error: unknown }) => !isHttpError(error, (status) => status < 500),
};

export const isNotFound = (error: unknown): boolean => isHttpError(error, 404);

/** Событие «повторить» для view: перезапускает запрос с последними параметрами. */
export const createRetry = <P>(query: { $params: Store<P | null>; refresh: EventCallable<P> }) => {
  const retryClicked = createEvent();
  sample({
    clock: retryClicked,
    source: query.$params,
    filter: (params): params is P => params !== null,
    target: query.refresh,
  });
  return retryClicked;
};

export type PageStatus = 'loading' | 'notFound' | 'error' | 'ready';

/** Состояние страницы для `variant`: данные есть → ready, иначе загрузка / 404 / ошибка. */
export const createPageStatus = (query: {
  $data: Store<unknown>;
  $error: Store<unknown>;
  $pending: Store<boolean>;
}) =>
  combine(query.$data, query.$error, query.$pending, (data, error, pending): PageStatus => {
    if (data) return 'ready';
    if (pending || !error) return 'loading';
    return isNotFound(error) ? 'notFound' : 'error';
  });
