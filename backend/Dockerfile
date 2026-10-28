# syntax=docker/dockerfile:1

# Shared Node.js base
FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*


# Build the application
FROM base AS build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma client and compile TypeScript
RUN npm run build


# Remove development dependencies
FROM build AS production-dependencies

RUN npm prune --omit=dev


# Production runtime
FROM base AS runtime

ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

# Run without root privileges
USER node

EXPOSE 4000

CMD ["node", "dist/src/server.js"]