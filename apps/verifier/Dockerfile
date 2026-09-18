# Multi-stage build for @verified-attention/verifier
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install dependencies (cached layer)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ packages/
COPY apps/verifier/package.json apps/verifier/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter @verified-attention/verifier...

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY apps/verifier/ ./apps/verifier/
WORKDIR /app/apps/verifier
RUN pnpm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs

# Copy built artifacts and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/apps/verifier/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/verifier/package.json ./package.json
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/packages ./packages

USER nodejs

# No exposed port - verifier runs as library/worker
ENTRYPOINT ["node", "dist/index.js"]