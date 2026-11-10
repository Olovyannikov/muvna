import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from './Skeleton.module.css';

export const Skeleton = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <div className={clsx(styles.skeleton, className)} style={style} aria-hidden="true" />
);
