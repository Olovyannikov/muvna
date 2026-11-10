/** Поля товара для карточки в списках (без подробного описания и галереи — они только на странице товара). */
export const productCardSelect = {
  title: true,
  slug: true,
  price: true,
  oldPrice: true,
  sku: true,
  materials: true,
  inStock: true,
  badge: true,
  image: true,
  series: true,
  category: true,
} as const;
