# Собирается из корня монорепо: docker build -f apps/web/Dockerfile .
FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @muvna/web...
COPY apps/web apps/web
RUN pnpm --filter @muvna/web build

# Caddy: раздаёт SPA, проксирует CMS (/api, /admin) и сам выпускает TLS-сертификат.
FROM caddy:2.10-alpine
COPY apps/web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/web/dist /srv
