@echo off
echo 🔧 Nettoyage complet du serveur Laravel...
echo.

REM Arrêter le serveur Laravel s'il tourne
echo ⏸️  Arrêt du serveur...
taskkill /F /IM php.exe 2>nul

REM Vider tous les caches Laravel
echo 🧹 Vidage des caches Laravel...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

REM Vider OPcache via un script PHP
echo 🗑️  Vidage OPcache...
php public/clear-opcache.php 2>nul

REM Exécuter les migrations
echo 📊 Exécution des migrations...
php artisan migrate --force

REM Optimiser
echo ⚡ Optimisation...
php artisan config:cache
php artisan route:cache

echo.
echo ✅ Nettoyage terminé!
echo.
echo 🚀 Démarrage du serveur...
start /B php artisan serve --host=0.0.0.0 --port=8000

echo.
echo ✅ Serveur démarré sur http://localhost:8000
echo.
echo 💡 Pour exposer avec ngrok, ouvrez un autre terminal et lancez:
echo    ngrok http 8000
echo.
pause
