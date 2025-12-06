# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for tests)
RUN npm ci

# Copy source code and test configuration
COPY src/ ./src/
COPY jest.config.js ./

# Run tests (optional - uncomment to enable)
# RUN npm test

# Stage 2: Runtime
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code from builder stage
COPY --from=builder /app/src ./src

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "src/index.js"]

