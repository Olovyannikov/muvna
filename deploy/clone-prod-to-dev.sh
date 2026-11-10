#!/usr/bin/env bash
# Копия контента прода в dev-стенд: без пользователей, заказов и заявок (персональные данные).
# Запуск на сервере: ~/muvna/deploy/clone-prod-to-dev.sh (dev-стенд должен быть поднят).
set -euo pipefail
P="docker compose -p muvna --env-file $HOME/muvna/.env -f $HOME/muvna/docker-compose.yml"
D="docker compose -p muvna-dev --env-file $HOME/muvna-dev/.env -f $HOME/muvna-dev/deploy/dev.compose.yml"
SKIP="leads orders orders_items payload_jobs payload_jobs_log payload_kv payload_locked_documents payload_locked_documents_rels payload_migrations payload_preferences payload_preferences_rels users users_sessions"

EXCL=(); IN=""
for t in $SKIP; do EXCL+=(-T "public.$t"); IN="$IN'$t',"; done
IN="${IN%,}"

$P exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --data-only --disable-triggers --no-owner --no-privileges "$@"' _ "${EXCL[@]}" > /tmp/dev-content.sql 2>/dev/null
TABLES=$($D exec -T postgres sh -c "psql -tA -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\" -c \"select string_agg(quote_ident(tablename), ', ') from pg_tables where schemaname='public' and tablename not in ($IN)\"")
{ echo "TRUNCATE $TABLES RESTART IDENTITY CASCADE;"; cat /tmp/dev-content.sql; } > /tmp/dev-restore.sql
$D cp /tmp/dev-restore.sql postgres:/tmp/restore.sql >/dev/null 2>&1
$D exec -T postgres sh -c 'psql -q -1 -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/restore.sql' 2>&1 | grep -iE "error" || true
$D exec -T postgres sh -c 'rm -f /tmp/restore.sql; psql -tA -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "select count(*) from products"'
rm -f /tmp/dev-content.sql /tmp/dev-restore.sql
docker run --rm -v muvna_media:/from:ro -v muvna-dev_media:/to alpine sh -c 'cp -a /from/. /to/ && ls /to | wc -l'
