# Étape 1 : Build de l'application
FROM node:lts-alpine AS build

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json ./
RUN npm install --include=dev

COPY . .

# Génération des types Prisma
RUN npx prisma generate

# Compilation TypeScript
RUN npm run build:full
RUN npm run build:seed

# Étape 2 : Exécution en production
FROM node:lts-alpine

WORKDIR /app

# 🔧 Installer le client PostgreSQL
RUN apk add --no-cache postgresql-client

COPY --from=build /app /app

COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

EXPOSE 3001

CMD ["/app/wait-for-db.sh"]
