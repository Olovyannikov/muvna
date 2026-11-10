import { reflect } from '@effector/reflect';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { NavSection } from '@/entities/site';

import type { Site } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { AppLink, BagIcon, CloseIcon, MenuIcon } from '@/shared/ui';

import { HeaderModel } from '../model';
import styles from './Header.module.css';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
};

interface Props {
  sections: NavSection[] | null;
  site: Site | null;
  cartCount: number;
  hasHero: boolean;
  isMenuOpen: boolean;
  openSection: number | null;
  onMenuToggle: () => void;
  onSectionHover: (id: number) => void;
  onSectionClick: (id: number) => void;
  onMegaMenuLeave: () => void;
  onCartClick: () => void;
}

const HeaderView = ({
  sections,
  site,
  cartCount,
  hasHero,
  isMenuOpen: menuOpen,
  openSection,
  onMenuToggle,
  onSectionHover,
  onSectionClick,
  onMegaMenuLeave,
  onCartClick,
}: Props) => {
  const t = useT();
  const scrolled = useScrolled();
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const transparent = hasHero && !scrolled && !menuOpen && openSection === null;
  const links = site?.navLinks ?? [];

  return (
    <>
      {site?.announcement && <div className={styles.announcement}>{site.announcement}</div>}
      <header
        className={clsx(styles.header, transparent && styles.transparent, hasHero && styles.overlay)}
        onMouseLeave={onMegaMenuLeave}
      >
        <div className={styles.bar}>
          <button
            type="button"
            className={clsx(styles.iconButton, styles.burger)}
            onClick={onMenuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <nav className={styles.utility} aria-label={t('nav.info')}>
            {links.map((link) => (
              <AppLink key={link.id ?? link.url} href={link.url} className={styles.utilityLink}>
                {link.label}
              </AppLink>
            ))}
          </nav>

          <Logo />

          <div className={styles.actions}>
            <LocaleSwitcher className={styles.desktopOnly} />
            <button
              type="button"
              className={styles.iconButton}
              onClick={onCartClick}
              aria-label={t('nav.cart', { count: cartCount })}
            >
              <BagIcon />
              {cartCount > 0 && <span className={styles.count}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <nav className={styles.catalog} aria-label={t('nav.catalog')}>
          <ul role="list" className={styles.sections}>
            {sections?.map((section) => (
              <li
                key={section.id}
                onMouseEnter={() => onSectionHover(section.id)}
                onFocus={() => onSectionHover(section.id)}
              >
                <button
                  type="button"
                  className={clsx(styles.sectionLink, openSection === section.id && styles.active)}
                  aria-expanded={openSection === section.id}
                  onClick={() => onSectionClick(section.id)}
                >
                  {section.title}
                </button>
                <div className={clsx(styles.mega, openSection === section.id && styles.megaOpen)}>
                  <div className={styles.megaInner}>
                    <p className={styles.megaTitle}>{section.title}</p>
                    <ul role="list" className={styles.megaList}>
                      {section.categories.map((category) => (
                        <li key={category.id}>
                          <AppLink href={category.href} className={styles.megaLink}>
                            {category.title}
                          </AppLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div id="mobile-menu" className={clsx(styles.mobile, menuOpen && styles.mobileOpen)} hidden={!menuOpen}>
        {sections?.map((section) => (
          <details key={section.id} className={styles.mobileSection}>
            <summary>{section.title}</summary>
            <ul role="list">
              {section.categories.map((category) => (
                <li key={category.id}>
                  <AppLink href={category.href}>{category.title}</AppLink>
                </li>
              ))}
            </ul>
          </details>
        ))}
        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <AppLink key={link.id ?? link.url} href={link.url}>
              {link.label}
            </AppLink>
          ))}
          <LocaleSwitcher />
        </div>
      </div>
    </>
  );
};

export const Header = reflect({ view: HeaderView, bind: HeaderModel.viewModel });
