// Деплой собранного .vercel/output в проект muvna-dev (вызывается из .github/workflows/vercel.yml).
// Env: VERCEL_TOKEN, VERCEL_SCOPE (slug команды, необязательно), PROD=1 — прод-алиас.
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT = 'muvna-dev';
// Франкфурт — ближе всего к CMS в Москве: каждый рендер ходит туда за данными.
const REGION = 'fra1';
const WAIT_MS = 4 * 60_000;
// apps/web: тут .vercel/output и привязка к проекту
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { VERCEL_TOKEN: token, VERCEL_SCOPE: scope, PROD, GITHUB_STEP_SUMMARY } = process.env;
if (!token) throw new Error('VERCEL_TOKEN не задан');

const api = async (path, init = {}) => {
  const url = new URL(path, 'https://api.vercel.com');
  if (scope) url.searchParams.set('slug', scope);
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(`${init.method ?? 'GET'} ${path}: ${res.status} ${JSON.stringify(body.error ?? body)}`);
  return body;
};
const vercel = (...args) =>
  execFileSync(
    'npx',
    ['--yes', 'vercel@65', ...args, '--token', token, ...(scope ? ['--scope', scope] : [])],
    {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  ).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const brief = (d) =>
  `${d.uid} ${d.readyState ?? d.state}${d.readySubstate ? `/${d.readySubstate}` : ''} ${d.target ?? 'preview'} ${new Date(d.createdAt ?? d.created).toISOString()}`;

// 1. регион функций — настройка проекта (regions в .vc-config.json подвешивает сборку)
try {
  await api(`/v9/projects/${PROJECT}`, {
    method: 'PATCH',
    body: JSON.stringify({ serverlessFunctionRegion: REGION }),
  });
  console.log(`function region: ${REGION}`);
} catch (e) {
  console.log(`::warning::регион функций не задан: ${e.message}`);
}

// 2. последние деплои; застрявшие дольше 10 минут — отменяем, чтобы не держали очередь
const { deployments = [] } = await api(`/v6/deployments?projectId=${PROJECT}&limit=10`);
console.log('recent deployments:\n' + deployments.map((d) => '  ' + brief(d)).join('\n'));
for (const d of deployments) {
  const stuck =
    ['BUILDING', 'QUEUED', 'INITIALIZING'].includes(d.state) && Date.now() - d.created > 10 * 60_000;
  if (stuck) {
    await api(`/v12/deployments/${d.uid}/cancel`, { method: 'PATCH' }).catch((e) => console.log(e.message));
    console.log(`cancelled stuck ${d.uid}`);
  }
}

// 3. деплой без ожидания в CLI — статус опрашиваем сами, чтобы видеть, на чём стоим
vercel('link', '--yes', '--project', PROJECT);
const url = vercel('deploy', '--prebuilt', '--no-wait', ...(PROD === '1' ? ['--prod'] : []));
console.log(`deployment: ${url}`);

let d;
let last = '';
for (const start = Date.now(); Date.now() - start < WAIT_MS; await sleep(5000)) {
  d = await api(`/v13/deployments/${new URL(url).host}`);
  const now = brief(d);
  if (now !== last) console.log(`  ${((Date.now() - start) / 1000).toFixed(0)}s ${(last = now)}`);
  if (['READY', 'ERROR', 'CANCELED'].includes(d.readyState)) break;
}

if (d?.readyState !== 'READY') {
  const { readyState, readySubstate, errorCode, errorMessage, regions, buildingAt, ready } = d ?? {};
  console.log(
    'deployment state:',
    JSON.stringify({ readyState, readySubstate, errorCode, errorMessage, regions, buildingAt, ready }),
  );
  try {
    console.log(vercel('inspect', url, '--logs'));
  } catch (e) {
    console.log(`inspect --logs: ${e.message}`);
  }
  throw new Error(`деплой не готов: ${d?.readyState}`);
}
if (GITHUB_STEP_SUMMARY) appendFileSync(GITHUB_STEP_SUMMARY, `### Vercel: ${url}\n`);
console.log(`Deployed: ${url}`);
