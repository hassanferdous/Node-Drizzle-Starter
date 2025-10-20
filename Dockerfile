# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency manifests
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy rest of the app
COPY . .

# Optional: build for production (only needed if you run `pnpm build`)
# You can comment this out in dev mode
# RUN pnpm build

# Expose internal port (just one number, not a range like 8000:8000)
# EXPOSE 8000

# Default command (overridden by docker-compose if needed)
CMD ["pnpm", "dev"]
