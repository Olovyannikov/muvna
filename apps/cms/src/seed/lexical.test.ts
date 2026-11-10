import { describe, expect, it } from 'vitest';

import { fromHtml, fromParagraphs } from './lexical';

type Node = { type: string; text?: string; format?: number; children?: Node[]; fields?: { url: string } };
const children = (state: { root: { children: unknown[] } }) => state.root.children as Node[];

describe('seed lexical converters', () => {
  it('turns Creatium modal HTML into paragraphs with bold text and line breaks', () => {
    const [first, second] = children(fromHtml('<p>Заголовок<br>Текст</p><p><strong>Важно:</strong> 58 мм</p>'));
    expect(first?.children?.map((node) => node.type)).toEqual(['text', 'linebreak', 'text']);
    expect(second?.children?.[0]).toMatchObject({ text: 'Важно:', format: 1 });
  });

  it('converts lists and autolinks emails', () => {
    const [list, paragraph] = children(
      fromHtml('<ul><li>Один</li><li>Два</li></ul><p>Пишите на info@elcanto.ru</p>'),
    );
    expect(list).toMatchObject({ type: 'list', children: [{ type: 'listitem' }, { type: 'listitem' }] });
    expect(paragraph?.children?.[1]).toMatchObject({ type: 'link', fields: { url: 'mailto:info@elcanto.ru' } });
  });

  it('skips empty paragraphs', () => {
    expect(children(fromParagraphs(['', 'Текст', null]))).toHaveLength(1);
  });
});
