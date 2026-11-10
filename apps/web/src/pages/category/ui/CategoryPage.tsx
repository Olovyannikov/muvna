import { HeroGate, useViewModel } from '@/shared/lib';
import { Image, QueryBoundary } from '@/shared/ui';

import { CategoryModel } from '../model';
import styles from './CategoryPage.module.css';
import { SeriesSection } from './SeriesSection';

export const CategoryPage = () => {
  const { view: data, error, isLoading, basePath, onRetryClick } = useViewModel(CategoryModel);

  return (
    <QueryBoundary loading={isLoading} error={data ? null : error} onRetry={onRetryClick}>
      {data && (
        <>
          <section className={styles.hero}>
            <HeroGate />
            <Image media={data.category.hero?.image} size="hero" priority className={styles.heroImage} />
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>{data.category.hero?.title || 'MUVNA'}</p>
              <h1 className={styles.title}>{data.category.title}</h1>
              {data.category.hero?.subtitle && (
                <p className={styles.subtitle}>{data.category.hero.subtitle}</p>
              )}
            </div>
          </section>
          {data.groups.map((group, index) => (
            <SeriesSection
              key={group.series?.id ?? 'other'}
              group={group}
              index={index}
              basePath={basePath}
            />
          ))}
        </>
      )}
    </QueryBoundary>
  );
};
