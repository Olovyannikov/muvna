import type { Payload } from 'payload';

type Ref = number | { id: number; slug?: string | null } | null | undefined;

const refSlug = async (ref: Ref, collection: 'sections' | 'categories', payload: Payload) => {
  if (!ref) return { slug: '', doc: null };
  const doc =
    typeof ref === 'object' && 'slug' in ref
      ? ref
      : await payload.findByID({
          collection,
          id: typeof ref === 'object' ? ref.id : ref,
          depth: 0,
          draft: true,
        });
  return { slug: doc?.slug ?? '', doc };
};

/** URL категории на фронте: /espresso/temper */
export const categoryPath = async (data: { slug?: string | null; section?: Ref }, payload: Payload) => {
  const section = await refSlug(data.section, 'sections', payload);
  return `/${section.slug}/${data.slug ?? ''}`;
};

/** URL товара на фронте: /espresso/temper/<slug товара> */
export const productPath = async (data: { slug?: string | null; category?: Ref }, payload: Payload) => {
  const { doc } = await refSlug(data.category, 'categories', payload);
  const base = doc ? await categoryPath(doc as { slug?: string; section?: Ref }, payload) : '';
  return `${base}/${data.slug ?? ''}`;
};
