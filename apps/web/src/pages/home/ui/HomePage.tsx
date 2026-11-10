import { reflect } from '@effector/reflect';

import { PageBlocks } from '@/widgets/page-blocks';

import type { Page } from '@/shared/api';
import { createPageView } from '@/shared/ui';

import { HomeModel } from '../model';

const HomeContent = reflect({
  view: ({ page }: { page: Page | null }) => <PageBlocks blocks={page?.layout} />,
  bind: { page: HomeModel.viewModel.page },
});

export const HomePage = createPageView({
  status: HomeModel.viewModel.status,
  onRetry: HomeModel.viewModel.onRetryClick,
  ready: HomeContent,
});
