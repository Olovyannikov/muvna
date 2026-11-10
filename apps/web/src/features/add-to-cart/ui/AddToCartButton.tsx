import { reflect } from '@effector/reflect';

import type { CartItem } from '@/entities/cart';

import type { Product } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { mediaUrl } from '@/shared/lib';
import { Button } from '@/shared/ui';

import { AddToCartModel } from '../model';

interface Props {
  product: Product;
  href: string;
  quantity?: number;
  size?: 'default' | 'small';
  block?: boolean;
  onAddClick: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
}

const AddToCartButtonView = ({ product, href, quantity, size = 'small', block, onAddClick }: Props) => {
  const t = useT();
  const unavailable = product.inStock === false;
  return (
    <Button
      size={size}
      block={block}
      disabled={unavailable}
      onClick={() =>
        onAddClick({
          productId: product.id,
          title: product.title,
          price: product.price,
          sku: product.sku,
          href,
          image: mediaUrl(product.image, 'thumb'),
          quantity,
        })
      }
    >
      {unavailable ? t('product.outOfStock') : t('product.addToCart')}
    </Button>
  );
};

export const AddToCartButton = reflect({ view: AddToCartButtonView, bind: AddToCartModel.viewModel });
