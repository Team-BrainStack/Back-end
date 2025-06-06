FROM node:22.1.0
# Set working directory
WORKDIR /app
# Install pnpm globally
RUN npm install -g pnpm
# Copy dependency manifests
COPY pnpm-lock.yaml ./
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
# Install dependencies with pnpm
RUN pnpm install
COPY src ./src
COPY . .
RUN if [ -f "./prisma/schema.prisma" ]; then pnpm prisma generate; else echo "Skipping prisma generate"; fi
RUN pnpm build
EXPOSE 3000
CMD ["node", "dist/index.js"]