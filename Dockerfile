ARG RUNTIME_IMAGE=node:24-slim

# Multi-stage Dockerfile
# Builder: use official Node 24 to install deps and build
FROM node:24 AS builder

WORKDIR /app

# Install all deps to allow lifecycle scripts (prepare/husky) to run, then prune
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Remove dev dependencies to keep node_modules light
RUN npm prune --production

# Runtime image choice: default to the requested Node 24 slim image.
# You can override this at build time if needed (for local testing):
# docker build --build-arg RUNTIME_IMAGE=node:24-slim -t image:tag .
FROM ${RUNTIME_IMAGE} AS runtime

WORKDIR /app

# Copy built output and production node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8989
ENV LOG_LEVEL=info
EXPOSE 8989

# Provide the server entrypoint via CMD.
CMD [".output/server/index.mjs"]
