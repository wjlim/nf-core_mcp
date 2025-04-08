FROM node:20-slim

WORKDIR /app

# Install git and clean up
RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and TypeScript config
COPY package*.json tsconfig.json ./

# Install TypeScript and dependencies
RUN npm install -g typescript && \
    npm install

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Set workspace directory
WORKDIR /app/workspace

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "/app/dist/index.js"] 