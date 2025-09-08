<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\Cache;

class SortieStatsService
{
    protected SortieConteneurService $sortieService;

    public function __construct(SortieConteneurService $sortieService)
    {
        $this->sortieService = $sortieService;
    }

    /**
     * Obtenir les statistiques avec cache
     */
    public function getStatistics(array $filters = []): array
    {
        $cacheKey = 'sorties_stats_' . md5(serialize($filters));
        
        return Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($filters) {
            return $this->sortieService->getStatistics($filters);
        });
    }

    /**
     * Sorties en cours
     */
    public function getSortiesEnCours(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return $this->sortieService->getSortiesEnCours($filters);
    }

    /**
     * Sorties retournées
     */
    public function getSortiesRetournees(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return $this->sortieService->getSortiesRetournees($filters);
    }

    /**
     * Timeline d'une sortie
     */
    public function getTimeline(SortieConteneur $sortie): array
    {
        return $this->sortieService->getTimeline($sortie);
    }

    /**
     * Informations de détention
     */
    public function getDetentionInfo(SortieConteneur $sortie): array
    {
        return $this->sortieService->getDetentionInfo($sortie);
    }

    /**
     * Informations de facturation
     */
    public function getFacturationInfo(SortieConteneur $sortie): array
    {
        return $this->sortieService->getFacturationInfo($sortie);
    }
}