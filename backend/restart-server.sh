#!/bin/bash

echo "🔧 Nettoyage complet du serveur Laravel..."

# Arrêter le serveur (si lancé avec php artisan serve)
echo "⏸️  Arrêt du serveur..."
pkill -f "php artisan serve" 2>/dev/null || true

# Vider tous les caches Laravel
echo "🧹 Vidage des caches Laravel..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

# Vider le cache OPcache (si disponible)
echo "🗑️  Vidage OPcache..."
php -r "if (function_exists('opcache_reset')) { opcache_reset(); echo 'OPcache vidé\n'; } else { echo 'OPcache non disponible\n'; }"

# Exécuter les migrations en attente
echo "📊 Exécution des migrations..."
php artisan migrate --force

# Regénérer les fichiers optimisés
echo "⚡ Optimisation..."
php artisan config:cache
php artisan route:cache

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "🚀 Pour démarrer le serveur, lancez:"
echo "   php artisan serve --host=0.0.0.0 --port=8000"
echo ""
echo "   Ou avec ngrok déjà configuré:"
echo "   ngrok http 8000"
