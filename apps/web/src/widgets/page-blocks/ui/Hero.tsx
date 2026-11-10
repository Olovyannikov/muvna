import clsx from 'clsx';
import { useState } from 'react';

import type { HeroBlock } from '@/shared/api';
import { Autoplay, ButtonLink, Carousel, Fade, Image } from '@/shared/ui';

import styles from './blocks.module.css';

const INTERVAL = 7000;

/** Первый экран: Embla (через @mantine/carousel) с плавной сменой слайдов, автопрокруткой и свайпом. */
export const Hero = ({ block, first }: { block: HeroBlock; first: boolean }) => {
  const slides = block.slides ?? [];
  // Плагины Embla создаются один раз на экземпляр карусели.
  const [plugins] = useState(() => [Autoplay({ delay: INTERVAL, stopOnInteraction: false }), Fade()]);
  const many = slides.length > 1;

  return (
    // data-hero-first: первый экран страницы — шапка над ним прозрачная (CSS :has, работает и при SSR).
    <section className={clsx(styles.hero, first && styles.heroFirst)} data-hero-first={first || undefined}>
      <Carousel
        height="100%"
        withControls={false}
        withIndicators={many}
        plugins={many ? plugins : []}
        emblaOptions={{ loop: true, duration: 30 }}
        classNames={{
          root: styles.heroCarousel,
          viewport: styles.heroViewport,
          container: styles.heroContainer,
          indicators: styles.heroDots,
          indicator: styles.heroDot,
        }}
      >
        {slides.map((slide, index) => (
          <Carousel.Slide key={slide.id ?? index} className={styles.heroSlide}>
            <Image media={slide.image} size="hero" priority={index === 0} className={styles.heroImage} />
            <div className={styles.heroContent}>
              {slide.eyebrow && <p className={styles.heroEyebrow}>{slide.eyebrow}</p>}
              {index === 0 && first ? (
                <h1 className={styles.heroTitle}>{slide.title}</h1>
              ) : (
                <h2 className={styles.heroTitle}>{slide.title}</h2>
              )}
              {slide.text && <p className={styles.heroText}>{slide.text}</p>}
              {slide.link?.url && slide.link.label && (
                <ButtonLink href={slide.link.url} variant="accent">
                  {slide.link.label}
                </ButtonLink>
              )}
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </section>
  );
};
