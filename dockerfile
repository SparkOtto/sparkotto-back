# ---------- builder ----------
FROM node:lts-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build:full
RUN npm run build:seed

# ---------- runtime ----------
FROM node:lts-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat postgresql-client

ENV NODE_ENV=production

# Copier uniquement le nécessaire
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

EXPOSE 3001
CMD ["/app/wait-for-db.sh"]
