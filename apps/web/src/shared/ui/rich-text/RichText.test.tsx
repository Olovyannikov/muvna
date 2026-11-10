import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { isRichTextEmpty, RichText, type LexicalState } from './RichText';

const doc = (children: LexicalState['root']['children']): LexicalState => ({ root: { children } });

describe('RichText', () => {
  it('renders paragraphs with text formats and line breaks', () => {
    const { container } = render(
      <RichText
        value={doc([
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'Темпер ', format: 0 },
              { type: 'text', text: 'Click', format: 1 | 2 },
              { type: 'linebreak' },
              { type: 'text', text: '58 мм' },
            ],
          },
        ])}
      />,
    );
    expect(container.querySelector('p')?.innerHTML).toBe('Темпер <strong><em>Click</em></strong><br>58 мм');
  });

  it('renders numbered lists and headings', () => {
    const { container } = render(
      <RichText
        value={doc([
          { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Условия' }] },
          {
            type: 'list',
            listType: 'number',
            children: [{ type: 'listitem', children: [{ type: 'text', text: 'Первое' }] }],
          },
        ])}
      />,
    );
    expect(container.querySelector('h2')?.textContent).toBe('Условия');
    expect(container.querySelector('ol > li')?.textContent).toBe('Первое');
  });

  it('treats a document of empty paragraphs as empty', () => {
    expect(isRichTextEmpty(doc([{ type: 'paragraph', children: [] }]))).toBe(true);
    expect(isRichTextEmpty(null)).toBe(true);
  });
});
