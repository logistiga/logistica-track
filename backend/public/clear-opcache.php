<?php
// Fichier temporaire pour vider OPcache
// Visitez ce fichier dans votre navigateur pour vider le cache
// Ex: http://localhost:8000/clear-opcache.php

if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "✅ OPcache vidé avec succès!<br>";
    echo "✅ Vous pouvez maintenant fermer cette page.<br>";
} else {
    echo "⚠️ OPcache n'est pas activé.<br>";
}

echo "<br><strong>Prochaines étapes:</strong><br>";
echo "1. Retournez à la page Archives Sortie<br>";
echo "2. Rechargez la page (F5 ou Ctrl+R)<br>";
echo "<br><a href='javascript:window.close()'>Fermer cette fenêtre</a>";
