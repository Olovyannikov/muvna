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
  // data-http-status: по нему SSR-сервер отдаёт код ответа 404.
  <section className={styles.root} data-http-status={code === '404' ? '404' : undefined}>
    <Container narrow className={styles.inner}>
      {code && <p className={styles.code}>{code}</p>}
      <h1 className={styles.title}>{title}</h1>
      {text && <p className={styles.text}>{text}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </Container>
  </section>
);
