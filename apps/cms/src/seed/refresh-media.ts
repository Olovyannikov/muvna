/**
 * Перезаливает файлы медиатеки с сохранением id документов (связи не трогаются):
 * исходник берётся из MEDIA_SOURCE_DIR/<имя>.png (например, после апскейла),
 * иначе — оригинал со старого muvna.ru. Payload заново строит все размеры.
 *
 *   pnpm --filter @muvna/cms media:refresh
 *   MEDIA_SOURCE_DIR=/path/to/upscaled pnpm --filter @muvna/cms media:refresh
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { getPayload } from 'payload';

import config from '../payload.config';

const ORIGIN = 'https://muvna.ru/m/b3a2df9a57f44a4be253085d64aaf6c6';
const sourceDir = process.env.MEDIA_SOURCE_DIR;
const onlyIds = process.env.MEDIA_IDS?.split(',').map(Number);

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

/** Старый сайт хранит исходники с разными расширениями — пробуем по очереди. */
const download = async (base: string) => {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const response = await fetch(`${ORIGIN}/${base}.${ext}`);
    if (response.ok) return { data: Buffer.from(await response.arrayBuffer()), ext };
  }
  throw new Error('исходник не найден');
};

const run = async () => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    pagination: false,
    where: onlyIds ? { id: { in: onlyIds } } : undefined,
  });
  let done = 0;
  let failed = 0;

  const queue = [...docs];
  const worker = async () => {
    for (let doc = queue.shift(); doc; doc = queue.shift()) {
      const base = (doc.filename ?? '').replace(/\.[^.]+$/, '');
      try {
        const local = sourceDir ? path.join(sourceDir, `${base}.png`) : null;
        const { data, ext } =
          local && existsSync(local) ? { data: readFileSync(local), ext: 'png' } : await download(base);
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {},
          file: { data, name: `${base}.${ext}`, size: data.length, mimetype: MIME[ext] ?? 'image/png' },
          overwriteExistingFiles: true,
        });
        done += 1;
        if (done % 25 === 0) console.log(`[media] ${done}/${docs.length}`);
      } catch (error) {
        failed += 1;
        console.log(`[media] ⚠ ${doc.id} ${base}: ${(error as Error).message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`[media] готово: ${done} обновлено, ${failed} с ошибками`);
  process.exit(failed ? 1 : 0);
};

await run();
