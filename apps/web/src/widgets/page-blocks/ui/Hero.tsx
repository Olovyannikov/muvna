import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { HeroBlock } from '@/shared/api';
import { HeroGate } from '@/shared/lib';
import { ButtonLink, Image } from '@/shared/ui';

import styles from './blocks.module.css';

const INTERVAL = 7000;

export const Hero = ({ block, first }: { block: HeroBlock; first: boolean }) => {
  const [active, setActive] = useState(0);
  const slides = block.slides ?? [];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className={clsx(styles.hero, first && styles.heroFirst)} aria-roledescription="carousel">
      {/* Только первый экран страницы делает шапку прозрачной. */}
      {first && <HeroGate />}
      {slides.map((slide, index) => (
        <div
          key={slide.id ?? index}
          className={clsx(styles.heroSlide, index === active && styles.heroSlideActive)}
          aria-hidden={index !== active}
        >
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
        </div>
      ))}
      {slides.length > 1 && (
        <div className={styles.heroDots}>
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              className={clsx(styles.heroDot, index === active && styles.heroDotActive)}
              onClick={() => setActive(index)}
              aria-label={`${index + 1} / ${slides.length}`}
              aria-current={index === active}
            />
          ))}
        </div>
      )}
    </section>
  );
};
