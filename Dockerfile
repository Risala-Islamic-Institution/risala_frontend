# syntax=docker/dockerfile:1

# 1) Base stage for common environment
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2) Install dependencies (cached)
FROM base AS deps
# Use bind mounts for package.json and package-lock.json, then generate pnpm-lock.yaml
RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/pnpm/store \
	# Check if pnpm-lock.yaml exists; if not, generate it from package-lock.json
	if [ ! -f pnpm-lock.yaml ]; then pnpm import; fi && \
	pnpm install --frozen-lockfile

# 3) Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Use cache mount for Next.js build cache to speed up subsequent builds
RUN --mount=type=cache,target=/app/.next/cache \
	pnpm run build

# 4) Runtime image
FROM node:24-alpine AS runner
LABEL app=risala_frontend
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Automatically leverage standalone output (smaller image)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3333
ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
