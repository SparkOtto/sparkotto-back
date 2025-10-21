#!/usr/bin/env sh
set -e

DB_HOST="${DB_HOST:-db}"
DB_USER="${DB_USER:-postgres}"
DB_PORT="${DB_PORT:-5432}"

echo "⏳ Attente de la base de données sur $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  sleep 2
done
echo "✅ Base de données prête !"

npx prisma db push

echo "🌱 Prisma seed..."
npx prisma db seed

ls -lah /app
ls -lah /app/dist
ls -lah /app/prisma

echo "🚀 Lancement de l'application Node.js"
node dist/index.js
