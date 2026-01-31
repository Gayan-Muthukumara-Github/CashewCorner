# syntax=docker/dockerfile:1.4
# ============================================
# Angular 19 Frontend Dockerfile
# Supports both SSR (Node.js) and Static (Nginx) modes
# ============================================

# Stage 1 — Build
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./

# Use BuildKit cache mount for npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build for production
# This creates both browser and server builds for SSR
RUN npm run build -- --configuration=production

# ============================================
# Stage 2a — SSR Runtime (Node.js)
# Use this for Server-Side Rendering
# ============================================
FROM node:20-alpine AS ssr-runtime

WORKDIR /app

# Create non-root user for security
RUN addgroup -S angular && \
    adduser -S angular -G angular

# Copy package files for production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --prefer-offline --no-audit

# Copy built application from build stage
COPY --from=build --chown=angular:angular /app/dist ./dist

# Switch to non-root user
USER angular:angular

# Expose port
EXPOSE 4000

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/ || exit 1

# Start SSR server
CMD ["node", "dist/CashewCorner.Frontend/server/server.mjs"]

# ============================================
# Stage 2b — Static Runtime (Nginx)
# Use this for static hosting without SSR
# ============================================
FROM nginx:alpine AS static-runtime

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config and default html files
RUN rm /etc/nginx/conf.d/default.conf && \
    rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/dist/CashewCorner.Frontend/browser /usr/share/nginx/html

# Rename index.csr.html to index.html if it exists (for SSR builds)
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
      mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi

# Create non-root user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
