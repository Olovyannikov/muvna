# Развёртывание в облаке

Всё работает на одной виртуальной машине в **Cloud.ru**: Docker Compose, без управляемых облачных сервисов. БД, медиатека и сертификаты лежат в Docker volumes на диске ВМ.

## Окружения

| Окружение | Адрес                                                                            | Ветка     | Каталог на сервере | Compose                  |
| --------- | -------------------------------------------------------------------------------- | --------- | ------------------ | ------------------------ |
| Прод      | https://168-113-255-143.sslip.io (админка: `/admin`)                             | `main`    | `~/muvna`          | `docker-compose.yml`     |
| Dev       | https://dev.168-113-255-143.sslip.io (не индексируется, `X-Robots-Tag: noindex`) | `develop` | `~/muvna-dev`      | `deploy/dev.compose.yml` |
| Локально  | http://localhost:5173, CMS — http://localhost:3000/admin                         | любая     | —                  | `docker-compose.dev.yml` |

`*.sslip.io` — бесплатные DNS-имена, указывающие на IP сервера. Они нужны, пока не подключён свой домен (см. «Домен и HTTPS»).

Пуш в `main` выкатывается на прод, пуш в `develop` — на dev (workflow `.github/workflows/deploy.yml`, около 2 минут). Логины в админку прода и dev разные, их выдаёт владелец проекта.

## Что запущено на сервере

```
                    ┌──────────── ВМ Cloud.ru (Ubuntu 24.04, Docker) ────────────┐
 :80/:443 ─► proxy (Caddy, HTTPS) ─┬─► prod-web:3001  SSR витрины (Node)        │
                                   ├─► prod-cms:3000  Payload CMS + админка     │  ~/muvna
                                   │       └─► postgres (volume muvna_pgdata)   │
                                   │       └─► медиа    (volume muvna_media)    │
                                   │                                            │
                                   └─► dev-web / dev-cms ─► свой postgres/media │  ~/muvna-dev
                                       (через общую сеть muvna-edge)            │
                    └───────────────────────────────────────────────────────────┘
```

- **proxy** (Caddy) живёт в прод-стеке. Он выпускает сертификаты Let's Encrypt, отправляет `/api`, `/admin` и `/_next` в CMS, остальное — в SSR витрины. Конфиг лежит в `deploy/Caddyfile`, при деплое он перечитывается (`caddy reload`).
- **web** — Node-сервер SSR. Ходит в CMS по внутренней сети (`CMS_INTERNAL_URL=http://cms:3000`) и отдаёт `sitemap.xml` и `robots.txt`.
- **cms** — Payload (Next standalone). При старте сам накатывает миграции (`prodMigrations`).
- Dev-стенд — отдельный compose-проект `muvna-dev` со своей БД, медиа и секретами. Наружу он торчит только через прокси прода по имени `DEV_SITE_ADDRESS`.

> ⚠️ Прокси обращается к проду только по именам `prod-cms` / `prod-web`. У dev-стенда в общей сети `muvna-edge` тоже есть сервисы `cms` и `web`. Если указать в Caddyfile просто `cms:3000`, прод начнёт ходить в dev (так уже было: весь сайт отдавал 404).

Секреты лежат в `~/muvna/.env` и `~/muvna-dev/.env` (права 600, в git не попадают; шаблон — `.env.example`).

## Повседневное

```bash
ssh user1@168.113.255.143

# прод
cd ~/muvna
docker compose ps                         # статус
docker compose logs -f --tail=100 web     # логи (web | cms | proxy | postgres)
docker compose restart cms

# dev
cd ~/muvna-dev
alias dc='docker compose -p muvna-dev --env-file .env -f deploy/dev.compose.yml'
dc ps; dc logs -f web
```

**Откат на прошлую версию.** Образы в GHCR помечены SHA коммита.

```bash
cd ~/muvna && sed -i "s/^TAG=.*/TAG=<sha рабочего коммита>/" .env && docker compose up -d
```

**Ручной деплой без CI**: то же самое, указав TAG нужного коммита, затем `docker compose pull && docker compose up -d`.

## Автодеплой (GitHub Actions)

Секреты репозитория: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (отдельный deploy-ключ `github-actions-deploy@muvna` в `~/.ssh/authorized_keys` пользователя `user1`). Чтобы отозвать доступ CI, удалите эту строку на сервере.

Что делает workflow:

1. Собирает образы `ghcr.io/olovyannikov/muvna-{cms,web}:<sha>` (пакеты публичные, на сервере `docker login` не нужен).
2. Копирует на сервер compose-файлы, Caddyfile и скрипты из `deploy/`.
3. Записывает `TAG=<sha>` в `.env`, выполняет `docker compose pull` и `up -d`, а для прода ещё `caddy reload`.

## Данные

| Что                   | Где                                   |
| --------------------- | ------------------------------------- |
| БД прода              | volume `muvna_pgdata`                 |
| Медиатека прода       | volume `muvna_media` (≈200 МБ)        |
| Сертификаты           | volume `muvna_caddy-data`             |
| БД / медиа dev-стенда | `muvna-dev_pgdata`, `muvna-dev_media` |

**Схема БД** меняется только миграциями. После изменения коллекций выполните локально `pnpm --filter @muvna/cms migrate:create <name>` и закоммитьте `apps/cms/src/migrations`. CMS на сервере накатит их при старте.

**Бэкапы.** Скрипт `deploy/backup.sh` делает дамп Postgres и архив медиатеки в `~/backups` и хранит последние 14 копий:

```bash
~/muvna/deploy/backup.sh
# ежедневно в 03:30:
( crontab -l 2>/dev/null; echo '30 3 * * * ~/muvna/deploy/backup.sh >> ~/backups/backup.log 2>&1' ) | crontab -
```

Бэкапы лежат на той же ВМ. От ошибок в данных они спасают, от потери ВМ — нет. Для этого их стоит регулярно копировать наружу (Object Storage Cloud.ru или `scp` к себе).

**Восстановление из бэкапа**:

```bash
cd ~/muvna
docker compose cp ~/backups/db-<stamp>.dump postgres:/tmp/db.dump
docker compose exec postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists /tmp/db.dump'
docker run --rm -v muvna_media:/media -v ~/backups:/b alpine sh -c 'tar -xzf /b/media-<stamp>.tgz -C /media'
docker compose restart cms web
```

**Обновить dev копией прода** (контент и медиа; пользователи, заказы и заявки не копируются):

```bash
~/muvna/deploy/clone-prod-to-dev.sh
```

## Домен и HTTPS

1. Направьте A-запись домена (например, `muvna.ru` и `dev.muvna.ru`) на `168.113.255.143`.
2. В `~/muvna/.env`:
   ```
   PUBLIC_URL=https://muvna.ru
   SITE_ADDRESS=muvna.ru
   REDIRECT_FROM=http://168.113.255.143   # или старый адрес, с которого нужен редирект
   DEV_SITE_ADDRESS=dev.muvna.ru
   ```
   В `~/muvna-dev/.env`: `PUBLIC_URL=https://dev.muvna.ru`.
3. Перезапустите стеки: `cd ~/muvna && docker compose up -d`, `cd ~/muvna-dev && docker compose -p muvna-dev --env-file .env -f deploy/dev.compose.yml up -d`. Caddy сам выпустит сертификаты, если порты 80 и 443 открыты наружу.

## Новый сервер с нуля

1. **ВМ.** Ubuntu 24.04, от 2 vCPU и 4 ГБ RAM. В группе безопасности Cloud.ru открыть входящие TCP 22 (только со своих IP), 80 и 443 (отовсюду). Добавить SSH-ключ пользователю.
2. **Docker и swap:**
   ```bash
   sudo apt-get update && sudo apt-get install -y ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list
   sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
   sudo usermod -aG docker $USER   # перелогиниться
   sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
3. **Прод:** `mkdir -p ~/muvna/deploy`, положите туда `docker-compose.yml` и `deploy/*` из репозитория. Создайте `.env` по шаблону `.env.example` (секреты: `openssl rand -hex 32`) и выполните `docker compose up -d`.
4. **Контент:** либо перенесите дамп и медиа из бэкапа (см. «Восстановление»), либо выполните первичное наполнение со старого muvna.ru: `docker compose --profile tools run --rm seed` (нужна сборка tools-образа из репозитория).
5. **Первый администратор:** откройте `/admin`, Payload предложит его создать.
6. **Dev-стенд (по желанию):** `mkdir -p ~/muvna-dev/deploy`, туда `deploy/dev.compose.yml` и `.env` (свои секреты, `PUBLIC_URL` dev-адреса), затем `docker compose -p muvna-dev --env-file .env -f deploy/dev.compose.yml up -d` и `~/muvna/deploy/clone-prod-to-dev.sh`.
7. **CI:** обновите секреты `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY` в настройках репозитория.

## Грабли

- **Сервер не может открыть сам себя по публичному IP или имени** (hairpin NAT в облаке). Проверять сайт нужно снаружи, а не `curl` с самой ВМ.
- **Кнопка «назад» и `@effector/router` 1.2.0.** Нативная блокировка POP-переходов зацикливает «назад», поэтому адаптер истории передаётся без `block` (исправление в effector/router#128).
