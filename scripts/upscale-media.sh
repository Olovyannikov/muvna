#!/usr/bin/env bash
# Апскейл медиатеки нейросетью Real-ESRGAN и перезаливка в Payload с сохранением id.
#
#   1. Скачайте realesrgan-ncnn-vulkan под свою ОС:
#      https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0
#   2. scripts/upscale-media.sh /path/to/realesrgan-ncnn-vulkan-dir
#
# CMS должна быть запущена (pnpm dev:cms). Исходники берутся с muvna.ru, результат
# (PNG ×4) кладётся в .upscaled/, затем `media:refresh` загружает его — Payload сам
# уменьшит до 2560 px и построит все размеры для srcset.
set -euo pipefail

ESRGAN_DIR="${1:?укажите папку с realesrgan-ncnn-vulkan}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$ROOT/.upscaled"
CMS="${CMS_URL:-http://localhost:3000}"
ORIGIN="https://muvna.ru/m/b3a2df9a57f44a4be253085d64aaf6c6"

mkdir -p "$WORK/raw" "$WORK/src" "$WORK/out"

echo "→ список медиафайлов"
curl -sf "$CMS/api/media?limit=1000&depth=0&pagination=false" \
  | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>JSON.parse(s).docs.forEach(d=>console.log(d.filename.replace(/\.[^.]+$/,""))))' \
  > "$WORK/names.txt"
echo "  файлов: $(wc -l < "$WORK/names.txt")"

echo "→ исходники с muvna.ru"
while read -r base; do
  [ -f "$WORK/src/$base.png" ] && continue
  for ext in png jpg jpeg webp; do
    if curl -sf -o "$WORK/raw/$base.$ext" "$ORIGIN/$base.$ext"; then
      # в src — только PNG, иначе нейросеть обработает и jpg-исходник
      sips -s format png "$WORK/raw/$base.$ext" --out "$WORK/src/$base.png" >/dev/null
      break
    fi
    rm -f "$WORK/raw/$base.$ext"
  done
done < "$WORK/names.txt"

echo "→ апскейл ×4 (realesrgan-x4plus)"
"$ESRGAN_DIR/realesrgan-ncnn-vulkan" -i "$WORK/src" -o "$WORK/out" -n realesrgan-x4plus -m "$ESRGAN_DIR/models" -f png

echo "→ перезаливка в Payload"
MEDIA_SOURCE_DIR="$WORK/out" pnpm --filter @muvna/cms media:refresh
echo "готово ✓"
