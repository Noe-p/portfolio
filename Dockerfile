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

# create non-root user (root for now)
RUN useradd -m -u 1001 nextjs

# Copy standalone build as root, then fix perms
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

# ensure dir exists and owned by nextjs
RUN mkdir -p /app/standalone/.next/cache \
    && chown -R nextjs:nextjs /app/standalone \
    && chmod -R u=rwX,go=rX /app/standalone

# switch to non-root
USER nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "standalone/server.js"]

