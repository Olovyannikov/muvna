import { createEvent, createStore } from 'effector';

import { CartModel } from '@/entities/cart';
import { SiteModel } from '@/entities/site';

import { $locale, localeSwitched } from '@/shared/i18n';
import { $hasHero, createModel } from '@/shared/lib';
import { router } from '@/shared/routing';

export const HeaderModel = createModel(() => {
  const menuToggled = createEvent();
  const menuClosed = createEvent();
  const sectionHovered = createEvent<number>();
  const sectionToggled = createEvent<number>();
  const megaMenuLeft = createEvent();

  /** Мобильное меню. */
  const $isMenuOpen = createStore(false)
    .on(menuToggled, (open) => !open)
    .reset(menuClosed, router.updated);

  /** Раздел, чьё мега-меню раскрыто. */
  const $openSection = createStore<number | null>(null)
    .on(sectionHovered, (_, id) => id)
    .on(sectionToggled, (current, id) => (current === id ? null : id))
    .reset(megaMenuLeft, router.updated);

  return {
    viewModel: {
      sections: SiteModel.navigationQuery.$data,
      site: SiteModel.siteQuery.$data,
      cartCount: CartModel.$count,
      hasHero: $hasHero,
      locale: $locale,
      isMenuOpen: $isMenuOpen,
      openSection: $openSection,
      onMenuToggle: menuToggled,
      onMenuClose: menuClosed,
      onSectionHover: sectionHovered,
      onSectionClick: sectionToggled,
      onMegaMenuLeave: megaMenuLeft,
      onCartClick: CartModel.drawerOpened,
      onLocaleClick: localeSwitched,
    },
  };
});
