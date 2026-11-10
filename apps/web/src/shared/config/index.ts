const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);

/** Сайт открыт из админки (Live Preview / «Предпросмотр») — показываем черновики. */
export const isPreview = params.has('preview');

/** Origin админки Payload: из него приходят postMessage Live Preview. */
export const cmsOrigin: string =
  import.meta.env.VITE_CMS_ORIGIN || (typeof window === 'undefined' ? '' : window.location.origin);

export const siteName = 'MUVNA';
