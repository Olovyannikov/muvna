import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './SectionHeading.module.css';

interface Props {
  eyebrow?: string | null;
  title?: string | null;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  title,
  align = 'left',
  as: Tag = 'h2',
  children,
  className,
}: Props) => {
  if (!eyebrow && !title && !children) return null;
  return (
    <header className={clsx(styles.heading, align === 'center' && styles.center, className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      {title && <Tag className={styles.title}>{title}</Tag>}
      {children}
    </header>
  );
};
