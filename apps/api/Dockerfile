# Multi-stage build for @verified-attention/api (S1.6 fix: full workspace install)
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Full workspace copy + install (resolves workspace links correctly)
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @verified-attention/api run build

# Runtime
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
COPY --from=base --chown=nodejs:nodejs /app/apps/api/dist ./dist
COPY --from=base --chown=nodejs:nodejs /app/apps/api/package.json ./package.json
COPY --from=base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nodejs:nodejs /app/packages ./packages
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
ENTRYPOINT ["node", "dist/index.js"]
