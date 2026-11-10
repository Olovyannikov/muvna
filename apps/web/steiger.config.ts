import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Тесты лежат рядом с моделями — это не нарушение публичного API.
    files: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
    rules: { 'fsd/no-public-api-sidestep': 'off' },
  },
]);
