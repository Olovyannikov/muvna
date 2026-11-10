import { createFactory, invoke } from '@withease/factories';
import type { Effect, EventCallable, Store } from 'effector';
import { useUnit } from 'effector-react';

/** Контракт для UI: что view читает (сторы) и что может вызвать (onXxx). Совпадает с формой useUnit(shape). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- события инвариантны по payload, иначе не описать
export type ViewModel = Record<string, EventCallable<any> | Effect<any, any, any> | Store<any>>;

/**
 * Модель-namespace. `viewModel` — единственное, что видит UI; остальное — API для других моделей.
 *
 *   export const CartModel = createModel(() => {
 *     const itemRemoved = createEvent<number>();
 *     const $items = createStore<CartItem[]>([]);
 *     return { itemRemoved, $items, viewModel: { items: $items, onRemoveClick: itemRemoved } };
 *   });
 */
export const createModel = <T extends object>(builder: () => T): T =>
  // invoke не выводит тип через обобщённый builder — результат фабрики и есть T.
  invoke(createFactory(builder)) as T;

/** Значения сторов и привязанные к скоупу колбэки из `Model.viewModel`. */
export const useViewModel = <VM extends ViewModel>(model: { viewModel: VM }) => useUnit(model.viewModel);
