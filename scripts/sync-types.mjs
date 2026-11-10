// Копирует сгенерированные Payload-типы во фронт, вырезая module augmentation пакета `payload`,
// чтобы web не зависел от payload даже на уровне типов.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../apps/cms/src/payload-types.ts', import.meta.url));
const to = fileURLToPath(new URL('../apps/web/src/shared/api/payload-types.ts', import.meta.url));

const source = readFileSync(from, 'utf8').replace(/\ndeclare module 'payload' \{[\s\S]*?\n\}\n?/, '\n');
writeFileSync(
  to,
  `// Сгенерировано scripts/sync-types.mjs из apps/cms — не редактировать руками.\n${source}`,
);
console.log(`types synced → ${to}`);
