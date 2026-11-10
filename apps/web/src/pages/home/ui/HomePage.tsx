import { PageBlocks } from '@/widgets/page-blocks';

import { useViewModel } from '@/shared/lib';
import { QueryBoundary } from '@/shared/ui';

import { HomeModel } from '../model';

export const HomePage = () => {
  const { page, error, isLoading, onRetryClick } = useViewModel(HomeModel);
  return (
    <QueryBoundary loading={isLoading} error={page ? null : error} onRetry={onRetryClick}>
      <PageBlocks blocks={page?.layout} />
    </QueryBoundary>
  );
};
