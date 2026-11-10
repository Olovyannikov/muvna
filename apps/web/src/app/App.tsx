import { RouterProvider } from '@effector/router-react';
import type { Scope } from 'effector';
import { Provider } from 'effector-react';

import { CartDrawer } from '@/widgets/cart-drawer';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import { isPreview } from '@/shared/config';
import { useT } from '@/shared/i18n';
import { router } from '@/shared/routing';

import styles from './App.module.css';
import { RoutesView } from './routes';

const PreviewBanner = () => {
  const t = useT();
  return <div className={styles.preview}>{t('preview.banner')}</div>;
};

export const App = ({ scope }: { scope: Scope }) => (
  <Provider value={scope}>
    <RouterProvider router={router}>
      <div className={styles.shell}>
        <Header />
        <main className={styles.main}>
          <RoutesView />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      {isPreview && <PreviewBanner />}
    </RouterProvider>
  </Provider>
);
