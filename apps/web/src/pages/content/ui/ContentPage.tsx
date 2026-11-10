import clsx from 'clsx';

import { PageBlocks } from '@/widgets/page-blocks';

import { useViewModel } from '@/shared/lib';
import { Container, QueryBoundary } from '@/shared/ui';

import { ContentModel } from '../model';
import styles from './ContentPage.module.css';

export const ContentPage = () => {
  const { page: data, error, isLoading, onRetryClick } = useViewModel(ContentModel);
  const startsWithHero = data?.layout?.[0]?.blockType === 'hero';

  return (
    <QueryBoundary loading={isLoading} error={data ? null : error} onRetry={onRetryClick}>
      {data && (
        <article>
          {!startsWithHero && (
            <Container className={clsx(styles.head)}>
              <h1 className={styles.title}>{data.title}</h1>
            </Container>
          )}
          <PageBlocks blocks={data.layout} />
        </article>
      )}
    </QueryBoundary>
  );
};
