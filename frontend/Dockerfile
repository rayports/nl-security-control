# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY public/ ./public/
COPY src/ ./src/

# Build the React app
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine AS runtime

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3005

# Health check (optional) - removed to avoid dependency on curl/wget
# If health checks are needed, install curl in runtime stage or use nginx status module
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3005/ || exit 1

# nginx runs automatically via default CMD

