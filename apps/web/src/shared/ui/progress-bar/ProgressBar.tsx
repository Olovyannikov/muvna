import styles from './ProgressBar.module.css';

/** Тонкая полоса загрузки вверху страницы; появляется с задержкой, чтобы не мигать на быстрых переходах. */
export const ProgressBar = ({ active }: { active: boolean }) => (
  <div className={styles.bar} data-active={active || undefined} role="progressbar" aria-hidden={!active} />
);
