import type { Media } from '../api';

type MediaRef = number | Media | null | undefined;
type Size = 'thumb' | 'card' | 'md' | 'hero';

export const asMedia = (ref: MediaRef): Media | null => (ref && typeof ref === 'object' ? ref : null);

/** Ссылка на нужный размер картинки из Payload с откатом на оригинал. */
export const mediaUrl = (ref: MediaRef, size?: Size): string | undefined => {
  const media = asMedia(ref);
  if (!media) return undefined;
  return (size && media.sizes?.[size]?.url) || media.url || undefined;
};

/**
 * srcset из всех ступеней Payload + оригинал (он тоже ограничен 2560 px).
 * Браузер сам берёт минимально достаточную ширину с учётом `sizes` и DPR.
 */
export const mediaSrcSet = (ref: MediaRef): string | undefined => {
  const media = asMedia(ref);
  if (!media) return undefined;
  const candidates = [...Object.values(media.sizes ?? {}), { url: media.url, width: media.width }].filter(
    (size): size is { url: string; width: number } => Boolean(size?.url && size.width),
  );
  const unique = [...new Map(candidates.map((size) => [size.width, size])).values()].sort(
    (a, b) => a.width - b.width,
  );
  return unique.length ? unique.map((size) => `${size.url} ${size.width}w`).join(', ') : undefined;
};
