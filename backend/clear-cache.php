<?php

// Script pour vider le cache Laravel
// À exécuter via: php backend/clear-cache.php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Vider tous les caches
echo "Vidage du cache de configuration...\n";
$kernel->call('config:clear');

echo "Vidage du cache de routes...\n";
$kernel->call('route:clear');

echo "Vidage du cache de vues...\n";
$kernel->call('view:clear');

echo "Vidage du cache d'application...\n";
$kernel->call('cache:clear');

echo "\nTous les caches ont été vidés avec succès!\n";
