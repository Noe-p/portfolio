# 1 - Install dependencies with Bun
FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 2 - Build Next.js
FROM node:18-bullseye AS builder
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN npm run build

# 3 - Runtime image
FROM node:18-slim AS runner
WORKDIR /app

# Copy standalone build as root so we can set ownership
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user and fix ownership & cache dir
RUN useradd -m nextjs \
 && mkdir -p /app/standalone/.next/cache \
 && chown -R nextjs:nextjs /app/standalone

USER nextjs
WORKDIR /app/standalone

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Start server listening on all interfaces inside the container (external access is restricted via docker-compose port binding)
CMD ["node", "server.js", "--hostname", "0.0.0.0"]
