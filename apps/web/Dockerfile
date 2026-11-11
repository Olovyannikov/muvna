# SSR-сервер витрины. Собирается из корня монорепо: docker build -f apps/web/Dockerfile .
FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @muvna/web...
COPY apps/web apps/web
RUN pnpm --filter @muvna/web build \
  && pnpm --filter @muvna/web deploy --prod --legacy /out \
  && cp -r apps/web/dist apps/web/server.mjs /out/

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 3001
CMD ["node", "server.mjs"]
