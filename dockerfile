# Étape 1 : Build de l'application
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Étape 2 : Exécution en production
FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3001

CMD ["node", "index.js"]
