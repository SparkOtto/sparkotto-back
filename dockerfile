# ---- Étape 1 : Build ----
FROM node:lts-alpine AS build
RUN apk add --no-cache git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

# Générer Prisma client (❌ pas de db push ici)
RUN npx prisma generate

# Build TypeScript (adapter si besoin)
RUN npm run build:full

# ---- Étape 2 : Runtime ----
FROM node:lts-alpine
WORKDIR /app

# pg_isready + libs prisca nécessaires
RUN apk add --no-cache postgresql-client openssl libc6-compat

ENV NODE_ENV=production

COPY --from=build /app /app

COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

EXPOSE 3001

CMD ["/app/wait-for-db.sh"]
