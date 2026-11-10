import {
  isLivePreviewEvent,
  mergeData,
  ready,
  type CollectionPopulationRequestHandler,
} from '@payloadcms/live-preview';
import { createFactory } from '@withease/factories';
import { createEffect, createEvent, scopeBind, type StoreWritable } from 'effector';
import { createAction } from 'effector-action';
import { update } from 'effector-refetch';

import { cmsOrigin, isPreview } from '../config';

type Doc = Record<string, unknown> & { id?: number | string };

interface PreviewMessage {
  collectionSlug?: string;
  globalSlug?: string;
  locale?: string;
  data: Doc;
}

/** Сырые сообщения от админки Payload (iframe Live Preview). */
export const livePreviewMessage = createEvent<PreviewMessage>();

// API CMS проксируется на тот же origin, что и сайт, — ходим относительным путём.
const sameOriginRequest: CollectionPopulationRequestHandler = ({ apiPath, data, endpoint }) =>
  fetch(`${apiPath}/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Payload-HTTP-Method-Override': 'GET' },
    body: JSON.stringify(data),
  });

/** Подключает слушатель postMessage и сообщает админке, что фронт готов. */
export const startLivePreviewFx = createEffect(() => {
  if (!isPreview || typeof window === 'undefined') return;
  // Колбэк window живёт вне графа — привязываем событие к скоупу, в котором запущен эффект.
  const received = scopeBind(livePreviewMessage, { safe: true });
  window.addEventListener('message', (event: MessageEvent) => {
    if (!isLivePreviewEvent(event, cmsOrigin)) return;
    const { collectionSlug, globalSlug, data, locale } = event.data as PreviewMessage;
    received({ collectionSlug, globalSlug, data, locale });
  });
  ready({ serverURL: cmsOrigin });
});

interface Patchable<T> {
  $data: { getState(): T | null } & object;
  __: { updateData: unknown };
}

interface SyncConfig<T> {
  query: Patchable<T>;
  collection?: string;
  global?: string;
  /** id документа на экране; без него сообщения не фильтруются по id (apply сам находит, куда вписать). */
  docId?: (data: T) => number | string | undefined;
  /** Вписать свежий документ в данные запроса. */
  apply: (data: T, doc: Doc) => T;
  depth?: number;
}

/**
 * Связывает запрос страницы с Live Preview: правки из админки дозаполняются
 * (relations, media) через API и сразу попадают в `$data` запроса.
 *
 * Фабрика: вызывать через `invoke(syncLivePreview<Data>, config)`.
 */
export const syncLivePreview = createFactory(
  <T>({ query, collection, global, docId, apply, depth = 2 }: SyncConfig<T>) => {
    const mergeFx = createEffect(
      ({ message, id }: { message: PreviewMessage; id: number | string | undefined }) =>
        mergeData<Doc>({
          collectionSlug: message.collectionSlug,
          globalSlug: message.globalSlug,
          incomingData: message.data,
          initialData: { ...message.data, id: message.data.id ?? id },
          locale: message.locale,
          depth,
          serverURL: '',
          requestHandler: sameOriginRequest,
        }),
    );

    createAction(livePreviewMessage, {
      source: { data: query.$data as unknown as StoreWritable<T | null> },
      target: { merge: mergeFx },
      fn: (target, { data }, message) => {
        // данных на экране ещё нет — дополнять нечего
        if (data === null) return;
        // сообщение про другую коллекцию / глобал
        if (global ? message.globalSlug !== global : message.collectionSlug !== collection) return;
        // в коллекции — только про документ, который сейчас показан
        const id = docId?.(data);
        if (!global && docId && message.data.id !== undefined && message.data.id !== id) return;
        target.merge({ message, id });
      },
    });

    update({
      query: query as never,
      on: mergeFx.doneData,
      // filter выше гарантирует, что данные уже загружены
      fn: ({ data, payload }: { data: T | null; payload: Doc }) => apply(data as T, payload),
    });
  },
);
