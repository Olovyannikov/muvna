#!/usr/bin/env bash
# Бэкап прода: дамп Postgres (custom format) + архив медиатеки. Хранит последние KEEP копий.
#   ~/muvna/deploy/backup.sh                 # вручную
#   crontab: 30 3 * * * ~/muvna/deploy/backup.sh >> ~/backups/backup.log 2>&1
set -euo pipefail
KEEP="${KEEP:-14}"
DIR="${BACKUP_DIR:-$HOME/backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
P="docker compose -p muvna --env-file $HOME/muvna/.env -f $HOME/muvna/docker-compose.yml"

mkdir -p "$DIR"
$P exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$DIR/db-$STAMP.dump"
docker run --rm -v muvna_media:/media:ro alpine tar -czf - -C /media . > "$DIR/media-$STAMP.tgz"
echo "[backup] $STAMP: db $(du -h "$DIR/db-$STAMP.dump" | cut -f1), media $(du -h "$DIR/media-$STAMP.tgz" | cut -f1)"

# ротация
ls -1t "$DIR"/db-*.dump | tail -n +$((KEEP + 1)) | xargs -r rm -f
ls -1t "$DIR"/media-*.tgz | tail -n +$((KEEP + 1)) | xargs -r rm -f
