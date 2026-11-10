# Собирается из корня монорепо: docker build -f apps/cms/Dockerfile .
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/cms/package.json apps/cms/
RUN pnpm install --frozen-lockfile --filter @muvna/cms...

FROM deps AS build
COPY apps/cms apps/cms
COPY scripts scripts
ENV NEXT_TELEMETRY_DISABLED=1
# Сборке нужен валидный конфиг, но не живая база.
RUN PAYLOAD_SECRET=build DATABASE_URL=postgres://build@localhost/build pnpm --filter @muvna/cms build

# Образ для разовых задач (сид, миграции): полный набор зависимостей.
FROM build AS tools
WORKDIR /repo/apps/cms
CMD ["pnpm", "seed"]

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 MEDIA_DIR=/app/media
RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/media && chown app:app /app/media
COPY --from=build --chown=app:app /repo/apps/cms/.next/standalone ./
COPY --from=build --chown=app:app /repo/apps/cms/.next/static ./apps/cms/.next/static
USER app
EXPOSE 3000
# Миграции накатываются при старте (prodMigrations в payload.config.ts).
CMD ["node", "apps/cms/server.js"]
