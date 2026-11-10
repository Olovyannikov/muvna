const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const formatPrice = (value: number): string => rub.format(value);

const plural = new Intl.PluralRules('ru-RU');

/** pluralize(3, ['товар', 'товара', 'товаров']) → «товара» */
export const pluralize = (count: number, [one, few, many]: [string, string, string]): string => {
  const rule = plural.select(count);
  return rule === 'one' ? one : rule === 'few' ? few : many;
};
