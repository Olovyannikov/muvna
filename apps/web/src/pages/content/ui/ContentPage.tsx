import { reflect } from '@effector/reflect';

import { PageBlocks } from '@/widgets/page-blocks';

import type { Page } from '@/shared/api';
import { Container, createPageView } from '@/shared/ui';

import { ContentModel } from '../model';
import styles from './ContentPage.module.css';

const ContentView = ({ page }: { page: Page | null }) => {
  if (!page) return null;
  const startsWithHero = page.layout?.[0]?.blockType === 'hero';
  return (
    <article>
      {!startsWithHero && (
        <Container className={styles.head}>
          <h1 className={styles.title}>{page.title}</h1>
        </Container>
      )}
      <PageBlocks blocks={page.layout} />
    </article>
  );
};

export const ContentPage = createPageView({
  status: ContentModel.viewModel.status,
  onRetry: ContentModel.viewModel.onRetryClick,
  ready: reflect({ view: ContentView, bind: { page: ContentModel.viewModel.page } }),
});
