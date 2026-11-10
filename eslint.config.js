import js from '@eslint/js';
import effector from 'eslint-plugin-effector';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/payload-types.ts',
      'apps/cms/src/app/(payload)/**',
      'apps/cms/src/migrations/**',
      'apps/cms/src/seed/data/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    // Часть правил effector опирается на типы.
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    plugins: { effector, 'react-hooks': reactHooks },
    rules: {
      ...effector.flatConfigs.recommended.rules,
      ...effector.flatConfigs.scope.rules,
      ...effector.flatConfigs.react.rules,
      ...reactHooks.configs.recommended.rules,
      // Слои FSD общаются только через публичный API слайса.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*/*/*', '!@/shared/*'],
              message: 'Импортируйте слайс через его public API (index.ts).',
            },
            {
              group: ['@mantine/*', 'embla-carousel*'],
              message: 'Mantine подключается только через @/shared/ui.',
            },
          ],
        },
      ],
    },
  },
  {
    // Mantine напрямую — только в shared/ui и в точке входа (CSS-слои после `@layer base, mantine`).
    files: ['apps/web/src/shared/ui/**/*.{ts,tsx}', 'apps/web/src/app/entry-client.tsx'],
    rules: { 'no-restricted-imports': 'off' },
  },
);
