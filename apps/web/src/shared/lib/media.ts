import type { Media } from '../api';

type MediaRef = number | Media | null | undefined;
type Size = 'thumb' | 'card' | 'hero';

export const asMedia = (ref: MediaRef): Media | null => (ref && typeof ref === 'object' ? ref : null);

/** Ссылка на нужный размер картинки из Payload с откатом на оригинал. */
export const mediaUrl = (ref: MediaRef, size?: Size): string | undefined => {
  const media = asMedia(ref);
  if (!media) return undefined;
  return (size && media.sizes?.[size]?.url) || media.url || undefined;
};

/** srcset из сгенерированных Payload размеров. */
export const mediaSrcSet = (ref: MediaRef): string | undefined => {
  const media = asMedia(ref);
  if (!media?.sizes) return undefined;
  const entries = Object.values(media.sizes)
    .filter((size): size is { url: string; width: number } => Boolean(size?.url && size.width))
    .sort((a, b) => a.width - b.width)
    .map((size) => `${size.url} ${size.width}w`);
  return entries.length ? entries.join(', ') : undefined;
};
