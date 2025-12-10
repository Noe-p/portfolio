# 1 - Install dependencies with Bun
FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 2 - Build Next.js with Node
FROM node:18-bullseye AS builder
WORKDIR /app

# Copy node_modules from Bun stage
COPY --from=deps /app/node_modules ./node_modules

# Copy app code
COPY . .

# Copy environment file
COPY .env.production .env

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3 - Runtime image
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

# Copy only the standalone build
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

EXPOSE 3000

CMD ["node", "standalone/server.js"]
