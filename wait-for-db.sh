#!/bin/sh
set -e

# Attente que la base de données soit prête
echo "⏳ Attente de la base de données..."
until pg_isready -h db -U postgres > /dev/null 2>&1; do
  sleep 2
done

echo "✅ Base de données prête !"

# Exécuter le seed
echo "🌱 Exécution de Prisma seed..."
npx prisma db seed

# Démarrer l'application
echo "🚀 Lancement de l'application Node.js"
node dist/index.js
