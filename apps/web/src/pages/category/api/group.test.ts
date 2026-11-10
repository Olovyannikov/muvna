import { describe, expect, it } from 'vitest';

import type { Product, Series } from '@/shared/api';

import { groupBySeries } from './index';

const series = (id: number) => ({ id, title: `S${id}` }) as Series;
const product = (id: number, seriesRef?: number | Series | null) => ({ id, series: seriesRef }) as Product;

describe('groupBySeries', () => {
  it('keeps series order and puts products into their series', () => {
    const groups = groupBySeries(
      [series(2), series(1)],
      [product(10, 1), product(11, 2), product(12, series(2))],
    );
    expect(groups.map((g) => [g.series?.id, g.products.map((p) => p.id)])).toEqual([
      [2, [11, 12]],
      [1, [10]],
    ]);
  });

  it('collects products without a (published) series into a trailing group', () => {
    const groups = groupBySeries([series(1)], [product(10, null), product(11, 99), product(12, 1)]);
    expect(groups.at(-1)).toEqual({ series: null, products: [product(10, null), product(11, 99)] });
  });
});
