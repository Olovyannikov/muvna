import { useT } from '@/shared/i18n';
import { AppLink } from '@/shared/ui';

import styles from './Header.module.css';

export const Logo = () => {
  const t = useT();
  return (
    <AppLink href="/" className={styles.logo} aria-label={t('nav.home')}>
      <svg viewBox="0 0 148 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M2 22V2l11 14L24 2v20" />
        <path d="M36 2v12a8 8 0 0 0 16 0V2" />
        <path d="M62 2l9 20 9-20" />
        <path d="M91 22V2l16 20V2" />
        <path d="M118 22l9-20 9 20M121.5 14h11" />
      </svg>
    </AppLink>
  );
};
