import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const cms = process.env.CMS_URL ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5173,
    // API, медиа и админка живут в CMS — в проде это тот же домен (Caddy), в dev проксируем.
    proxy: { '/api': cms },
  },
  test: { environment: 'jsdom', globals: false },
});
