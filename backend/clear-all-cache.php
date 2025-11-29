<?php

// Script pour nettoyer complètement tous les caches Laravel
echo "🧹 Nettoyage complet des caches Laravel...\n\n";

// Nettoyer le cache d'application
echo "1️⃣ Cache application...\n";
exec('php artisan cache:clear', $output1);
print_r($output1);

// Nettoyer le cache de configuration
echo "\n2️⃣ Cache configuration...\n";
exec('php artisan config:clear', $output2);
print_r($output2);

// Nettoyer le cache de routes
echo "\n3️⃣ Cache routes...\n";
exec('php artisan route:clear', $output3);
print_r($output3);

// Nettoyer le cache de vues
echo "\n4️⃣ Cache vues...\n";
exec('php artisan view:clear', $output4);
print_r($output4);

// Nettoyer toutes les optimisations
echo "\n5️⃣ Optimisations...\n";
exec('php artisan optimize:clear', $output5);
print_r($output5);

// Si OPcache est activé, le vider
if (function_exists('opcache_reset')) {
    echo "\n6️⃣ OPcache PHP...\n";
    opcache_reset();
    echo "OPcache vidé avec succès!\n";
} else {
    echo "\n6️⃣ OPcache PHP non disponible\n";
}

echo "\n✅ Tous les caches ont été nettoyés!\n";
echo "⚠️  Redémarrez maintenant le serveur Laravel (Ctrl+C puis 'php artisan serve')\n";
