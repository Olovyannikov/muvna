import type { Category, Product, Section } from '@/shared/api';

const asObject = <T extends object>(value: number | T | null | undefined): T | null =>
  value && typeof value === 'object' ? value : null;

export const productCategory = (product: Product): Category | null => asObject(product.category);

export const productSection = (product: Product): Section | null => {
  const category = productCategory(product);
  return category ? asObject(category.section) : null;
};

/** URL товара: /<раздел>/<категория>/<товар>. Нужен product с depth ≥ 2. */
export const productHref = (product: Product): string => {
  const category = productCategory(product);
  const section = productSection(product);
  return category && section ? `/${section.slug}/${category.slug}/${product.slug}` : '#';
};
