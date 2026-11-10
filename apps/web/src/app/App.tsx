import { RouterProvider } from '@effector/router-react';
import type { Scope } from 'effector';
import { Provider } from 'effector-react';

import { CartDrawer } from '@/widgets/cart-drawer';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import { isPreview } from '@/shared/config';
import { useT } from '@/shared/i18n';
import { router } from '@/shared/routing';
import { MantineProvider, theme } from '@/shared/ui';

import styles from './App.module.css';
import { AppGate } from './model';
import { RoutesView } from './routes';

const PreviewBanner = () => {
  const t = useT();
  return <div className={styles.preview}>{t('preview.banner')}</div>;
};

export const App = ({ scope }: { scope: Scope }) => (
  <Provider value={scope}>
    <MantineProvider theme={theme} forceColorScheme="light">
      <RouterProvider router={router}>
        <AppGate />
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
    </MantineProvider>
  </Provider>
);
