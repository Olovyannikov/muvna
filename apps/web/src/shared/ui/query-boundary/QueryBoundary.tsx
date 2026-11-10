import type { ReactNode } from 'react';

import { useT } from '../../i18n';
import { isNotFound } from '../../lib';
import { Button, ButtonLink } from '../button/Button';
import { ErrorState } from '../error-state/ErrorState';
import { Skeleton } from '../skeleton/Skeleton';
import styles from './QueryBoundary.module.css';

interface Props {
  loading: boolean;
  error: unknown;
  onRetry?: () => void;
  /** Заглушка на время первой загрузки. */
  fallback?: ReactNode;
  children: ReactNode;
}

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

/** Состояния страницы с данными из CMS: загрузка → 404 / ошибка → контент. */
export const QueryBoundary = ({ loading, error, onRetry, fallback = <PageSkeleton />, children }: Props) => {
  const t = useT();
  if (loading) return <>{fallback}</>;
  if (isNotFound(error)) {
    return (
      <ErrorState code="404" title={t('errors.notFoundTitle')} text={t('errors.notFoundText')}>
        <ButtonLink href="/">{t('errors.toHome')}</ButtonLink>
      </ErrorState>
    );
  }
  if (error) {
    return (
      <ErrorState title={t('errors.loadTitle')} text={t('errors.loadText')}>
        {onRetry && <Button onClick={onRetry}>{t('errors.retry')}</Button>}
      </ErrorState>
    );
  }
  return <>{children}</>;
};
