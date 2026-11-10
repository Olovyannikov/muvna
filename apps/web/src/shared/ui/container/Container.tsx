import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import styles from './Container.module.css';

export const Container = ({
  narrow,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) => (
  <div className={clsx(styles.container, narrow && styles.narrow, className)} {...props} />
);
