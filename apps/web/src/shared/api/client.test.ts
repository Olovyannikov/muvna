import { describe, expect, it } from 'vitest';

import { stringifyQuery } from './client';

describe('stringifyQuery', () => {
  it('serializes nested where clauses the way Payload (qs) expects', () => {
    const query = stringifyQuery({ where: { slug: { equals: 'temper' } }, depth: 2, skip: undefined });
    expect(decodeURIComponent(query)).toBe('where[slug][equals]=temper&depth=2');
  });

  it('serializes arrays of objects (and/or clauses)', () => {
    const query = stringifyQuery({
      where: { and: [{ slug: { equals: 'a' } }, { 'section.slug': { equals: 'b' } }] },
    });
    expect(decodeURIComponent(query)).toBe(
      'where[and][0][slug][equals]=a&where[and][1][section.slug][equals]=b',
    );
  });

  it('serializes arrays with indices', () => {
    expect(decodeURIComponent(stringifyQuery({ where: { id: { in: [1, 2] } } }))).toBe(
      'where[id][in][0]=1&where[id][in][1]=2',
    );
  });
});
