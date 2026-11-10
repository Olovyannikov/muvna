import { list, reflect } from '@effector/reflect';

import type { Category } from '@/shared/api';
import { HeroGate } from '@/shared/lib';
import { createPageView, Image } from '@/shared/ui';

import type { SeriesGroup } from '../api';
import { CategoryModel } from '../model';
import styles from './CategoryPage.module.css';
import { SeriesSection } from './SeriesSection';

const CategoryHeroView = ({ category }: { category: Category | null }) =>
  category && (
    <section className={styles.hero}>
      <HeroGate />
      <Image media={category.hero?.image} size="hero" priority className={styles.heroImage} />
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>{category.hero?.title || 'MUVNA'}</p>
        <h1 className={styles.title}>{category.title}</h1>
        {category.hero?.subtitle && <p className={styles.subtitle}>{category.hero.subtitle}</p>}
      </div>
    </section>
  );

const CategoryHero = reflect({
  view: CategoryHeroView,
  bind: { category: CategoryModel.viewModel.category },
});

const SeriesList = list({
  source: CategoryModel.viewModel.groups,
  view: SeriesSection,
  bind: { basePath: CategoryModel.viewModel.basePath },
  mapItem: { group: (group: SeriesGroup) => group, index: (_: SeriesGroup, index: number) => index },
  getKey: (group) => group.series?.id ?? 'other',
});

export const CategoryPage = createPageView({
  status: CategoryModel.viewModel.status,
  onRetry: CategoryModel.viewModel.onRetryClick,
  ready: () => (
    <>
      <CategoryHero />
      <SeriesList />
    </>
  ),
});
