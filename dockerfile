FROM node:18-alpine as build

WORKDIR /app

# Set environment variables
ARG ENVIRONMENT=prod
ENV ENVIRONMENT=$ENVIRONMENT

# Copy package files for better dependency caching
COPY package*.json ./

# Install dependencies - preserving existing approach
RUN npm ci

# Copy source code
COPY . .

# Add environment configuration preparation
RUN if [ -f "scripts/prepare-env.js" ]; then \
    mkdir -p config && \
    node scripts/prepare-env.js $ENVIRONMENT || echo "Using default configuration"; \
fi

# Build the application - preserving existing command
RUN npm run build

# Production stage
FROM nginx:alpine

# Add health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# Copy nginx configuration - preserving existing path
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
