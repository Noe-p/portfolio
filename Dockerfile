# 1 - Install dependencies with Bun
FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 2 - Build Next.js
FROM node:18-bullseye AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3 - Runtime image
FROM node:18-slim AS runner
WORKDIR /app

# Non-root user
RUN useradd -m nextjs
USER nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone build
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

# Bind uniquement en local
CMD ["node", "standalone/server.js", "--hostname", "127.0.0.1"]
