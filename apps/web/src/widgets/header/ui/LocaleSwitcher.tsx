import clsx from 'clsx';

import { locales, useT } from '@/shared/i18n';
import { useViewModel } from '@/shared/lib';

import { HeaderModel } from '../model';
import styles from './Header.module.css';

export const LocaleSwitcher = ({ className }: { className?: string }) => {
  const t = useT();
  const { locale, onLocaleClick } = useViewModel(HeaderModel);
  return (
    <div className={clsx(styles.locales, className)} role="group" aria-label={t('nav.language')}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={clsx(styles.locale, code === locale && styles.localeActive)}
          aria-pressed={code === locale}
          onClick={() => onLocaleClick(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
