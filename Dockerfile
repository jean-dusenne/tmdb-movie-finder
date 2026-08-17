FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

RUN npm prune --production

FROM node:24-slim AS runtime

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8989
ENV LOG_LEVEL=info
EXPOSE 8989

CMD [".output/server/index.mjs"]
