import { reflect, variant } from '@effector/reflect';
import type { EventCallable, Store } from 'effector';
import type { ComponentType } from 'react';

import { useT } from '../../i18n';
import type { PageStatus } from '../../lib';
import { Button, ButtonLink } from '../button/Button';
import { ErrorState } from '../error-state/ErrorState';
import { Skeleton } from '../skeleton/Skeleton';
import styles from './PageView.module.css';

export const PageSkeleton = () => (
  <div className={styles.skeleton} aria-busy="true">
    <Skeleton className={styles.hero} />
    <div className={styles.grid}>
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className={styles.card} />
      ))}
    </div>
  </div>
);

export const NotFoundState = () => {
  const t = useT();
  return (
    <ErrorState code="404" title={t('errors.notFoundTitle')} text={t('errors.notFoundText')}>
      <ButtonLink href="/">{t('errors.toHome')}</ButtonLink>
    </ErrorState>
  );
};

const LoadErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const t = useT();
  return (
    <ErrorState title={t('errors.loadTitle')} text={t('errors.loadText')}>
      <Button onClick={onRetry}>{t('errors.retry')}</Button>
    </ErrorState>
  );
};

interface PageViewConfig {
  status: Store<PageStatus>;
  onRetry: EventCallable<void>;
  /** Страница с данными. */
  ready: ComponentType;
  loading?: ComponentType;
}

/** Страница с данными из CMS: variant по статусу запроса — скелетон / 404 / ошибка / контент. */
export const createPageView = ({ status, onRetry, ready, loading = PageSkeleton }: PageViewConfig) =>
  variant({
    source: status,
    cases: {
      loading,
      notFound: NotFoundState,
      error: reflect({ view: LoadErrorState, bind: { onRetry } }),
      ready,
    },
  });
