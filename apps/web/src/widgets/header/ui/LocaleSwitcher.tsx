import { reflect } from '@effector/reflect';
import clsx from 'clsx';

import { locales, useT, type Locale } from '@/shared/i18n';

import { HeaderModel } from '../model';
import styles from './Header.module.css';

interface Props {
  locale: Locale;
  onLocaleClick: (locale: Locale) => void;
  className?: string;
}

const LocaleSwitcherView = ({ locale, onLocaleClick, className }: Props) => {
  const t = useT();
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

export const LocaleSwitcher = reflect({
  view: LocaleSwitcherView,
  bind: { locale: HeaderModel.viewModel.locale, onLocaleClick: HeaderModel.viewModel.onLocaleClick },
});
