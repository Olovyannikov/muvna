import { describe, expect, it } from 'vitest';

import { slugify } from './slugify';

describe('slugify', () => {
  it('transliterates Cyrillic into a kebab-case slug', () => {
    expect(slugify('Темпер Muvna Click Sonorous Tamper D58,35, серебро')).toBe(
      'temper-muvna-click-sonorous-tamper-d58-35-serebro',
    );
  });

  it('drops soft/hard signs and trims dashes', () => {
    expect(slugify('  Подъёмный — «Объём» ')).toBe('podemnyy-obem');
  });
});
