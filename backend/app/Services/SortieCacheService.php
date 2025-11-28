<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class SortieCacheService
{
    /**
     * Clés de cache pour les sorties
     */
    private const CACHE_KEYS = [
        'sorties_all',
        'sorties_en_cours',
        'sorties_retournees'
    ];

    /**
     * Générer une clé de cache basée sur les paramètres
     */
    public function generateCacheKey(string $prefix, array $params = []): string
    {
        return $prefix . '_' . md5(serialize($params));
    }

    /**
     * Invalider tous les caches liés aux sorties
     */
    public function invalidateAllCaches(): void
    {
        // Invalider les clés définies
        foreach (self::CACHE_KEYS as $key) {
            Cache::forget($key);
        }
        
        // Invalider TOUS les caches qui commencent par 'sorties_'
        // Cela inclut les clés générées dynamiquement
        Cache::flush(); // Alternative: utiliser tags si disponible
    }

    /**
     * Invalider les caches de statistiques
     */
    public function invalidateStatsCaches(): void
    {
        // Pattern pour supprimer tous les caches de stats
        $tags = ['sorties_stats_*'];
        foreach ($tags as $tag) {
            Cache::forget($tag);
        }
    }

    /**
     * Récupérer ou créer un cache
     */
    public function remember(string $key, int $ttl, \Closure $callback)
    {
        return Cache::remember($key, $ttl, $callback);
    }
}