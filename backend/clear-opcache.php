<?php
// Fichier temporaire pour vider OPcache
// Visitez ce fichier dans votre navigateur pour vider le cache
// Ex: http://localhost:8000/clear-opcache.php

if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "✅ OPcache vidé avec succès!<br>";
} else {
    echo "⚠️ OPcache n'est pas activé.<br>";
}

echo "<br>Maintenant, essayez de recharger la page Archives Sortie.";
