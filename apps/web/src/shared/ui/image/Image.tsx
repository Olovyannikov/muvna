import clsx from 'clsx';
import { useState, type CSSProperties } from 'react';

import type { Media } from '../../api';
import { asMedia, mediaSrcSet, mediaUrl } from '../../lib';
import styles from './Image.module.css';

interface Props {
  media: number | Media | null | undefined;
  size?: 'thumb' | 'card' | 'hero';
  sizes?: string;
  alt?: string;
  /** Соотношение сторон контейнера, напр. "1 / 1"; без него картинка занимает родителя. */
  ratio?: string;
  fit?: 'cover' | 'contain';
  priority?: boolean;
  className?: string;
}

export const Image = ({
  media,
  size = 'card',
  sizes = '100vw',
  alt,
  ratio,
  fit = 'cover',
  priority,
  className,
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const resolved = asMedia(media);
  const src = mediaUrl(resolved, size);
  const focal: CSSProperties =
    resolved?.focalX != null ? { objectPosition: `${resolved.focalX}% ${resolved.focalY ?? 50}%` } : {};

  return (
    <div
      className={clsx(styles.frame, !ratio && styles.fill, className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {src && (
        <img
          className={clsx(styles.image, fit === 'contain' && styles.contain, loaded && styles.loaded)}
          src={src}
          srcSet={mediaSrcSet(resolved)}
          sizes={sizes}
          alt={alt ?? resolved?.alt ?? ''}
          width={resolved?.width ?? undefined}
          height={resolved?.height ?? undefined}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          style={focal}
          onLoad={() => setLoaded(true)}
          ref={(node) => {
            if (node?.complete) setLoaded(true);
          }}
        />
      )}
    </div>
  );
};
