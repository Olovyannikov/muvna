import type { ReactNode } from 'react';

import styles from './ProductGrid.module.css';

export const ProductGrid = ({ children }: { children: ReactNode }) => (
  <div className={styles.grid}>{children}</div>
);
