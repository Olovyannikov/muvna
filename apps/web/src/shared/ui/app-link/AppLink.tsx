import { useUnit } from 'effector-react';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';

import { isExternalHref, normalizeHref } from '../../lib';
import { router } from '../../routing';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string | null | undefined };

/**
 * Ссылка по строковому пути (из CMS). Внутренние переходы идут через router.navigate,
 * внешние и модифицированные клики (Cmd/Ctrl, средняя кнопка) — нативно.
 */
export const AppLink = ({ href: rawHref, onClick, target, rel, ...props }: Props) => {
  const navigate = useUnit(router.navigate);
  const href = normalizeHref(rawHref);
  const external = isExternalHref(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      external ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== '_self') ||
      href.startsWith('#')
    ) {
      return;
    }
    event.preventDefault();
    const url = new URL(href, window.location.origin);
    navigate({ path: url.pathname });
    if (url.hash) requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView());
  };

  return (
    <a
      href={href}
      target={external && !href.startsWith('mailto:') && !href.startsWith('tel:') ? '_blank' : target}
      rel={external ? 'noopener noreferrer' : rel}
      onClick={handleClick}
      {...props}
    />
  );
};
