# MUVNA

Новый сайт [muvna.ru](https://muvna.ru) — каталог кофейных инструментов MUVNA с корзиной и заказами, контентом которого управляют из CMS без передеплоя.

- **apps/web** — витрина: React 19 + effector, Vite + SSR на Node, Feature-Sliced Design.
- **apps/cms** — Payload CMS 3 (Next.js) + PostgreSQL: каталог, страницы-конструкторы, заказы, заявки, медиатека.

## Окружения

| Окружение    | Сайт                                                                 | Админка                                    | Ветка     |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------ | --------- |
| Прод         | https://168-113-255-143.sslip.io                                     | https://168-113-255-143.sslip.io/admin     | `main`    |
| Dev          | https://dev.168-113-255-143.sslip.io                                 | https://dev.168-113-255-143.sslip.io/admin | `develop` |
| Dev (Vercel) | https://muvna-dev.vercel.app — витрина на Vercel, контент из dev-CMS | —                                          | `develop` |
| Локально     | http://localhost:5173                                                | http://localhost:3000/admin                | —         |

Пуш в ветку автоматически выкатывается в её окружение. Как всё устроено в облаке (Cloud.ru), бэкапы, домен и подъём сервера с нуля описаны в [docs/deployment.md](docs/deployment.md).

## Возможности

- **Визуальный конструктор страниц.** Страницы (главная, «Сотрудничество», «Контакты» и т.д.) собираются из блоков: первый экран-карусель, манифест, «фото + текст», текст, подборка товаров, плитки категорий, форма заявки.
- **Live Preview.** Сайт открывается в админке рядом с формой, правки видны сразу, ещё до сохранения. Есть режимы «телефон», «планшет» и «десктоп».
- **Версии и черновики.** У страниц, категорий, серий, товаров и настроек сайта есть автосохранение черновиков, история версий со сравнением и откатом, а у страниц ещё и отложенная публикация. Посетители видят только опубликованное.
- **Два языка.** Контент в CMS локализован (ru/en, незаполненный английский берётся из русского). Интерфейс переводится через i18next. Язык — часть URL: русский на `/…`, английский на `/en/…`.
- **SEO.** Страницы рендерятся на сервере: `<title>` и `description` из SEO-полей CMS, `canonical`, `hreflang`, Open Graph, JSON-LD `Product` с ценой, честные 404, `sitemap.xml` (оба языка) и `robots.txt`.
- **Каталог.** Разделы → категории → серии (описание линейки) → товары с галереей, характеристиками и подробным описанием.
- **Корзина и заказы.** Корзина хранится в localStorage. Заказ уходит в CMS, цены пересчитываются на сервере по базе. Заявки на оптовый прайс собираются в коллекцию «Заявки».

## Быстрый старт

```bash
pnpm install
pnpm db:up                      # Postgres в Docker (docker-compose.dev.yml)
cp apps/cms/.env.example apps/cms/.env   # задайте PAYLOAD_SECRET и пароль администратора
pnpm dev                        # CMS → http://localhost:3000/admin, сайт (SSR + HMR) → http://localhost:5173
pnpm seed && pnpm --filter @muvna/cms seed:en   # один раз: контент со старого muvna.ru, английская локаль, администратор
```

Dev-сервер витрины (`apps/web/server.mjs`) — тот же SSR, что в проде, но через Vite с HMR. `/api` проксируется в CMS, поэтому в браузере сайт и API живут на одном origin, как и в проде.

| Команда                                          | Что делает                                                      |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `pnpm lint` / `pnpm format`                      | ESLint (typescript-eslint, effector, react-hooks) / Prettier    |
| `pnpm --filter @muvna/web lint:fsd`              | Проверка архитектуры FSD (steiger)                              |
| `pnpm typecheck` / `pnpm test`                   | TypeScript / Vitest                                             |
| `pnpm --filter @muvna/cms generate:types`        | Типы Payload → `apps/cms/src/payload-types.ts` и копия во фронт |
| `pnpm --filter @muvna/cms migrate:create <name>` | Миграция БД после изменения схемы коллекций                     |

## Архитектура фронтенда

FSD: `app → pages → widgets → features → entities → shared`, импорты только через public API слайса (`index.ts`). Импорты сортирует Prettier по группам: библиотеки, затем слои FSD сверху вниз, в конце относительные.

Вся логика живёт в effector, UI ничего не решает сам:

- **SSR.** На каждый запрос сервер делает свой `fork()` с изолированным кэшем запросов: язык и переводы → история из URL (маршрут и его данные, `allSettled`) → `renderToString` → `serialize(scope)` и кэш effector-refetch в HTML (`app/entry-server.tsx`). Браузер восстанавливает скоуп и кэш, повторяет тот же старт без сети и гидрирует (`app/entry-client.tsx`). Браузерное (корзина из localStorage, Live Preview) стартует из `AppGate` после гидратации, чтобы разметка не разошлась с серверной.
- Внешние колбэки (`postMessage`, `history.listen`) привязаны через `scopeBind`.
- Модели — это namespace на `createModel` поверх `@withease/factories`. UI видит только `viewModel`: сторы для чтения и обработчики `onXxx`, связанные с view через [`@effector/reflect`](https://github.com/effector/reflect) (`reflect`, `variant` для состояний страницы, `list`). Остальное — API для других моделей.

  ```ts
  export const CartModel = createModel(() => {
    // ...
    return {
      itemAdded, // для других моделей
      viewModel: { items: $items, total: $total, onRemoveClick: itemRemoved }, // для UI
    };
  });

  export const CartSummary = reflect({ view: CartSummaryView, bind: CartModel.viewModel });
  ```

- Данные из CMS загружаются через [effector-refetch](https://github.com/Olovyannikov/effector-refetch). Запросы привязаны к маршрутам `@effector/router` (`attachToRoute`), у каждого стабильный `name` (sid для SSR), язык подставляется через `source: { locale: $locale }`. Списки берут из CMS только поля карточки (`select`/`populate`).
- Язык в URL: адаптер истории (`shared/routing/locale.ts`) снимает и добавляет префикс `/en`, поэтому маршруты от языка не зависят.
- Live Preview: `syncLivePreview` (фабрика) принимает сообщения админки, дозаполняет связи через API и вписывает их в `$data` нужного запроса.
- i18n: `@withease/i18next`, словари `shared/i18n/locales/{ru,en}.ts` с типизированными ключами.

## Продакшн

Одна ВМ в Cloud.ru, Docker Compose: Postgres, Payload CMS, SSR-витрина на Node и Caddy (HTTPS, маршрутизация). CI (`ci.yml`) прогоняет форматирование, линтеры, steiger, типы, тесты и сборку, deploy (`deploy.yml`) собирает образы в GHCR и выкатывает `main` на прод, `develop` — на dev. Подробно: [docs/deployment.md](docs/deployment.md).
