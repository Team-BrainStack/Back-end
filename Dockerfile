FROM node:22.1.0

WORKDIR /app

<<<<<<< HEAD
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
=======
# Copy only needed files
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Copy Prisma folder only if it exists by copying everythig, relying on .dockerignore
COPY . .

RUN npm install

RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
>>>>>>> 8013f1d20bff9c1f8e6a1f0166ee09aec98b30ef
