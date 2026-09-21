# ─────────────────────────────────────────────────────────────
# Stage 1 — Build the React / Vite frontend
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
# → produces /app/dist


# ─────────────────────────────────────────────────────────────
# Stage 2 — Compile the Express / TypeScript backend
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY server/ ./server/

# Compile server TypeScript → JavaScript
RUN npx tsc --project tsconfig.node.json --outDir dist-server --noEmit false 2>/dev/null || \
    npx tsx --version > /dev/null && echo "TSX available, will use at runtime"


# ─────────────────────────────────────────────────────────────
# Stage 3 — Production image
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend from stage 1
COPY --from=frontend-builder /app/dist ./dist

# Copy server source (tsx compiles at runtime — avoids complex tsc config)
COPY server/ ./server/
COPY tsconfig*.json ./

# Add a lightweight static file server for the built frontend
# The Express server will serve /dist as static files + handle /api routes
COPY --from=frontend-builder /app/dist ./public

# Expose backend port
EXPOSE 3001

# Healthcheck — waits for the API to be ready
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Start the Express server (tsx used so no separate compile step needed)
CMD ["npx", "tsx", "server/index.ts"]
