/** Сборка lexical-JSON (формат richText в Payload) из простого текста/HTML со старого сайта. */

type Node = Record<string, unknown>;

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const };

export const text = (value: string, format = 0): Node => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
});

const linebreak = (): Node => ({ type: 'linebreak', version: 1 });

const link = (url: string, label: string): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { url, newTab: false, linkType: 'custom' },
  children: [text(label)],
});

/** Текст с автоссылками на email и телефоны. */
const inline = (value: string, format = 0): Node[] => {
  const nodes: Node[] = [];
  const pattern = /([\w.+-]+@[\w-]+\.[\w.]+)|(\+7[\s\d()-]{10,16}\d)/g;
  let last = 0;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text(value.slice(last, index), format));
    const [found] = match;
    nodes.push(link(match[1] ? `mailto:${found}` : `tel:${found.replace(/[^\d+]/g, '')}`, found));
    last = index + found.length;
  }
  if (last < value.length) nodes.push(text(value.slice(last), format));
  return nodes;
};

export const paragraph = (children: Node[]): Node => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children,
});

export const heading = (value: string, tag: 'h2' | 'h3' | 'h4' = 'h3'): Node => ({
  ...base,
  type: 'heading',
  tag,
  children: [text(value)],
});

export const list = (items: string[], ordered = false): Node => ({
  ...base,
  type: 'list',
  listType: ordered ? 'number' : 'bullet',
  tag: ordered ? 'ol' : 'ul',
  start: 1,
  children: items.map((item, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    children: inline(item),
  })),
});

export const root = (children: Node[]) => ({ root: { ...base, type: 'root', children } });

/** Абзацы → richText. Переносы строк внутри абзаца сохраняются. */
export const fromParagraphs = (paragraphs: (string | null | undefined)[]) =>
  root(
    paragraphs
      .filter((value): value is string => Boolean(value?.trim()))
      .map((value) =>
        paragraph(
          value.split('\n').flatMap((line, index) => (index ? [linebreak(), ...inline(line)] : inline(line))),
        ),
      ),
  );

const decode = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Простой HTML из модалок Creatium (<p>, <br>, <strong>/<b>, <ul>/<li>) → richText. */
export const fromHtml = (html: string) => {
  const blocks: Node[] = [];
  const parts = html.split(/(<ul>[\s\S]*?<\/ul>|<ol>[\s\S]*?<\/ol>)/i);
  for (const part of parts) {
    if (/^<(ul|ol)>/i.test(part)) {
      const items = [...part.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((m) =>
        decode(m[1]!.replace(/<[^>]+>/g, '')).trim(),
      );
      if (items.length) blocks.push(list(items, /^<ol>/i.test(part)));
      continue;
    }
    // Двойной перенос = новый абзац.
    const paragraphs = part
      .replace(/<\/?p[^>]*>/gi, '\n\n')
      .replace(/(<br\s*\/?>\s*){2,}/gi, '\n\n')
      .split(/\n{2,}/);
    for (const raw of paragraphs) {
      const children: Node[] = [];
      const tokens = raw.split(/(<br\s*\/?>|<\/?(?:strong|b)>)/i);
      let bold = false;
      for (const token of tokens) {
        if (/^<br/i.test(token)) children.push(linebreak());
        else if (/^<(strong|b)>$/i.test(token)) bold = true;
        else if (/^<\/(strong|b)>$/i.test(token)) bold = false;
        else {
          const value = decode(token.replace(/<[^>]+>/g, ''));
          if (value.trim()) children.push(...inline(value, bold ? 1 : 0));
        }
      }
      while (children[0]?.type === 'linebreak') children.shift();
      while (children.at(-1)?.type === 'linebreak') children.pop();
      if (children.length) blocks.push(paragraph(children));
    }
  }
  return root(blocks);
};
