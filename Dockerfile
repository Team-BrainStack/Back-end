FROM node:22.1.0

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma

RUN pnpm install

COPY src ./src
COPY src/generated ./src/generated
COPY . .

RUN if [ -f "./prisma/schema.prisma" ]; then pnpm prisma generate; else echo "Skipping prisma generate"; fi

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
