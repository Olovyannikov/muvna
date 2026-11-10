import { useT } from '@/shared/i18n';
import { MinusIcon, PlusIcon } from '@/shared/ui';

import { MAX_QUANTITY } from '../model';
import styles from './QuantityControl.module.css';

interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const QuantityControl = ({ value, onChange, label }: Props) => {
  const t = useT();
  return (
    <div className={styles.control} role="group" aria-label={t('product.quantity', { title: label })}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value - 1)}
        aria-label={t('product.less')}
      >
        <MinusIcon size={16} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={t('product.more')}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
};
