# MUVNA

Новый сайт [muvna.ru](https://muvna.ru) — каталог кофейных инструментов MUVNA с корзиной и заказами, контентом которого управляют из CMS без передеплоя.

- **apps/web** — витрина: React 19 + effector, Vite, Feature-Sliced Design.
- **apps/cms** — Payload CMS 3 (Next.js) + PostgreSQL: каталог, страницы-конструкторы, заказы, заявки, медиатека.

## Возможности

- **Визуальный конструктор страниц.** Страницы (главная, «Сотрудничество», «Контакты» и т.д.) собираются из блоков: первый экран-карусель, манифест, «фото + текст», текст, подборка товаров, плитки категорий, форма заявки.
- **Live Preview.** Сайт открывается в админке рядом с формой, правки видны сразу, ещё до сохранения. Есть режимы «телефон», «планшет» и «десктоп».
- **Версии и черновики.** У страниц, категорий, серий, товаров и настроек сайта есть автосохранение черновиков, история версий со сравнением и откатом, а у страниц ещё и отложенная публикация. Посетители видят только опубликованное.
- **Два языка.** Контент в CMS локализован (ru/en, незаполненный английский берётся из русского). Интерфейс переводится через i18next. Язык переключается в шапке.
- **Каталог.** Разделы → категории → серии (описание линейки) → товары с галереей, характеристиками и подробным описанием.
- **Корзина и заказы.** Корзина хранится в localStorage. Заказ уходит в CMS, цены пересчитываются на сервере по базе. Заявки на оптовый прайс собираются в коллекцию «Заявки».

## Быстрый старт

```bash
pnpm install
pnpm db:up                      # Postgres в Docker (docker-compose.dev.yml)
cp apps/cms/.env.example apps/cms/.env   # задайте PAYLOAD_SECRET и пароль администратора
pnpm dev                        # CMS → http://localhost:3000/admin, сайт → http://localhost:5173
pnpm seed && pnpm --filter @muvna/cms seed:en   # один раз: контент со старого muvna.ru, английская локаль, администратор
```

Vite проксирует `/api` в CMS, поэтому в браузере сайт и API живут на одном origin, как и в проде.

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

- Приложение работает в `fork()`-скоупе (`<Provider value={scope}>`). Старт идёт через `allSettled(appStarted, { scope })`. Внешние колбэки (`postMessage` Live Preview) привязаны через `scopeBind`, корзина восстанавливается из localStorage через `persist({ pickup: appStarted })`.
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

- Данные из CMS загружаются через [effector-refetch](https://github.com/Olovyannikov/effector-refetch). Запросы привязаны к маршрутам `@effector/router` (`attachToRoute`), язык подставляется через `source: { locale: $locale }`, при смене языка срабатывает `keepFresh`.
- Live Preview: `syncLivePreview` (фабрика) принимает сообщения админки, дозаполняет связи через API и вписывает их в `$data` нужного запроса.
- i18n: `@withease/i18next`, словари `shared/i18n/locales/{ru,en}.ts` с типизированными ключами.

## Продакшн

Одна машина, `docker-compose.yml`: **Postgres**, **CMS** (Next standalone, миграции накатываются при старте) и **Caddy**. Caddy раздаёт SPA, проксирует `/api` и `/admin` в CMS и сам выпускает HTTPS-сертификат. CMS и сайт живут на одном домене, поэтому cookie редактора работает и в Live Preview.

```bash
# на сервере
git clone https://github.com/Olovyannikov/muvna.git && cd muvna
cp .env.example .env            # PUBLIC_URL, SITE_ADDRESS, пароли, PAYLOAD_SECRET
docker compose up -d --build    # или docker compose pull, если образы собирает CI
docker compose --profile tools run --rm seed   # первичное наполнение
```

CI (`.github/workflows/ci.yml`) прогоняет форматирование, линтеры, steiger, типы, тесты и сборку. Deploy (`deploy.yml`) собирает образы в GHCR и, если заданы секреты `VPS_HOST`, `VPS_USER` и `VPS_SSH_KEY`, обновляет контейнеры на сервере. Если пакеты GHCR приватные, на сервере один раз выполните `docker login ghcr.io`.
