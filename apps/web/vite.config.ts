import { fileURLToPath, URL } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const cms = process.env.CMS_URL ?? 'http://localhost:3000';

// sid для юнитов: по ним serialize/fork переносит состояние с сервера на клиент.
// Фабрики вызываются через invoke из @withease/factories — плагин учитывает его сам.
// HMR юнитов — только в браузере: в SSR-модулях нет import.meta.hot (sid от hmr не зависят).
// Отдельный экземпляр на окружение: пресеты с одним плагином внутри одного babel() не делятся.
const effector = async (client: boolean, hmr: 'es' | false): Promise<Plugin> => {
  // типизирован как rolldown-плагин, но в Vite это обычный Vite-плагин (с applyToEnvironment)
  const plugin = (await babel({
    include: /[\\/]src[\\/].*\.[jt]sx?$/,
    plugins: [['effector/babel-plugin', { hmr }]],
  })) as unknown as Plugin;
  return {
    ...plugin,
    name: `${plugin.name}:effector-${client ? 'client' : 'ssr'}`,
    applyToEnvironment: (env) =>
      (env.config.consumer === 'client') === client && (plugin.applyToEnvironment?.(env) ?? true),
  };
};

export default defineConfig(({ command }) => ({
  plugins: [
    effector(true, command === 'serve' && !process.env.VITEST ? 'es' : false),
    effector(false, false),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // API, медиа и админка живут в CMS — в проде это тот же домен (Caddy), в dev проксируем.
    proxy: { '/api': cms },
  },
  // Для Vercel SSR-бандл самодостаточный: зависимости внутри, node_modules функции не нужны.
  ssr: process.env.SSR_BUNDLE_DEPS === '1' ? { noExternal: true, target: 'node' } : undefined,
  test: { environment: 'jsdom', globals: false },
}));
