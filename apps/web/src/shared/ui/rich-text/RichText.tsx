import clsx from 'clsx';
import { Fragment, type ReactNode } from 'react';

import { mediaSrcSet, mediaUrl } from '../../lib';
import { AppLink } from '../app-link/AppLink';
import styles from './RichText.module.css';

/** Минимальная форма lexical-JSON, которую отдаёт Payload. */
export interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: 'bullet' | 'number' | 'check';
  fields?: { url?: string; newTab?: boolean; linkType?: string; doc?: { value?: { slug?: string } } };
  value?: unknown;
  [key: string]: unknown;
}

export interface LexicalState {
  root: { children: LexicalNode[] };
}

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;

const renderText = (node: LexicalNode, key: number): ReactNode => {
  const format = typeof node.format === 'number' ? node.format : 0;
  let content: ReactNode = node.text ?? '';
  if (format & IS_CODE) content = <code>{content}</code>;
  if (format & IS_STRIKETHROUGH) content = <s>{content}</s>;
  if (format & IS_UNDERLINE) content = <u>{content}</u>;
  if (format & IS_ITALIC) content = <em>{content}</em>;
  if (format & IS_BOLD) content = <strong>{content}</strong>;
  return <Fragment key={key}>{content}</Fragment>;
};

const renderChildren = (nodes: LexicalNode[] = []): ReactNode[] => nodes.map(renderNode);

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function renderNode(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key);
    case 'linebreak':
      return <br key={key} />;
    case 'paragraph':
      return <p key={key}>{renderChildren(node.children)}</p>;
    case 'heading': {
      const Tag = (headingTags.has(node.tag ?? '') ? node.tag : 'h3') as 'h2';
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case 'quote':
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>;
    case 'link':
    case 'autolink': {
      const href =
        node.fields?.linkType === 'internal' && node.fields.doc?.value?.slug
          ? `/${node.fields.doc.value.slug}`
          : node.fields?.url;
      return (
        <AppLink key={key} href={href} target={node.fields?.newTab ? '_blank' : undefined}>
          {renderChildren(node.children)}
        </AppLink>
      );
    }
    case 'horizontalrule':
      return <hr key={key} />;
    case 'upload': {
      const src = mediaUrl(node.value as never, 'card');
      return src ? (
        <img
          key={key}
          src={src}
          srcSet={mediaSrcSet(node.value as never)}
          sizes="(min-width: 800px) 760px, 100vw"
          alt=""
          loading="lazy"
        />
      ) : null;
    }
    default:
      return node.children ? <Fragment key={key}>{renderChildren(node.children)}</Fragment> : null;
  }
}

export const isRichTextEmpty = (value: LexicalState | null | undefined): boolean =>
  !value?.root?.children?.some((node) => (node.children?.length ?? 0) > 0 || node.type === 'upload');

export const RichText = ({
  value,
  className,
  size = 'default',
}: {
  value: LexicalState | null | undefined;
  className?: string;
  size?: 'default' | 'large';
}) => {
  if (!value || isRichTextEmpty(value)) return null;
  return (
    <div className={clsx(styles.richText, size === 'large' && styles.large, className)}>
      {renderChildren(value.root.children)}
    </div>
  );
};
