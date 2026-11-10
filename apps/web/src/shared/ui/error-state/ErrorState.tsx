import type { ReactNode } from 'react';

import { Container } from '../container/Container';
import styles from './ErrorState.module.css';

interface Props {
  code?: string;
  title: string;
  text?: string;
  children?: ReactNode;
}

export const ErrorState = ({ code, title, text, children }: Props) => (
  <section className={styles.root}>
    <Container narrow className={styles.inner}>
      {code && <p className={styles.code}>{code}</p>}
      <h1 className={styles.title}>{title}</h1>
      {text && <p className={styles.text}>{text}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </Container>
  </section>
);
