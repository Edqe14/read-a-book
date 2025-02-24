FROM imbios/bun-node:1.2.3-18.20.7-alpine AS base

WORKDIR /app

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY . .
RUN bun install

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build
RUN bun run db:push

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENV SENTRY_URL=https://errors.edqe.me/
ENV SENTRY_ORG=tsuiika
ENV SENTRY_PROJECT=read-a-book
ENV SENTRY_SAMPLE_RATE=0.4

RUN addgroup --system nodejs && \
  adduser --system nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
CMD ["node", "server.js"]
