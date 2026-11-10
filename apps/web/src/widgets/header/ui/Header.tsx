import { reflect } from '@effector/reflect';
import clsx from 'clsx';

import type { NavSection } from '@/entities/site';

import type { Site } from '@/shared/api';
import { useT } from '@/shared/i18n';
import { Accordion, AppLink, BagIcon, Burger, Drawer, useWindowScroll } from '@/shared/ui';

import { HeaderModel } from '../model';
import styles from './Header.module.css';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';

interface Props {
  sections: NavSection[] | null;
  site: Site | null;
  cartCount: number;
  hasHero: boolean;
  isMenuOpen: boolean;
  openSection: number | null;
  onMenuToggle: () => void;
  onMenuClose: () => void;
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
  onMenuClose,
  onSectionHover,
  onSectionClick,
  onMegaMenuLeave,
  onCartClick,
}: Props) => {
  const t = useT();
  const [{ y }] = useWindowScroll();
  const scrolled = y > 24;

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
          <Burger
            className={styles.burger}
            opened={menuOpen}
            onClick={onMenuToggle}
            size="sm"
            color="currentColor"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          />

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

      <Drawer
        opened={menuOpen}
        onClose={onMenuClose}
        position="left"
        size="100%"
        withCloseButton={false}
        hiddenFrom="lg"
        withOverlay={false}
        zIndex={40}
        classNames={{ inner: styles.mobileInner, content: styles.mobile, body: styles.mobileBody }}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Accordion
          classNames={{ item: styles.mobileSection, control: styles.mobileControl }}
          chevronPosition="right"
        >
          {sections?.map((section) => (
            <Accordion.Item key={section.id} value={String(section.id)}>
              <Accordion.Control>{section.title}</Accordion.Control>
              <Accordion.Panel>
                <ul role="list" className={styles.mobileList}>
                  {section.categories.map((category) => (
                    <li key={category.id}>
                      <AppLink href={category.href}>{category.title}</AppLink>
                    </li>
                  ))}
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <AppLink key={link.id ?? link.url} href={link.url}>
              {link.label}
            </AppLink>
          ))}
          <LocaleSwitcher />
        </div>
      </Drawer>
    </>
  );
};

export const Header = reflect({ view: HeaderView, bind: HeaderModel.viewModel });
