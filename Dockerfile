FROM node:20-slim

WORKDIR /app

# Install git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Clone nf-core repositories
WORKDIR /app/workspace
RUN git clone https://github.com/nf-core/rnaseq.git && \
    git clone https://github.com/nf-core/modules.git && \
    git clone https://github.com/nf-core/sarek.git && \
    git clone https://github.com/nf-core/tools.git

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV WORKSPACE_DIR=/app/workspace

# Start the server
CMD ["npm", "start"] 