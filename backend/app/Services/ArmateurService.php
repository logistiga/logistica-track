<?php

namespace App\Services;

use App\Models\Armateur;
use App\Models\Detention;

class ArmateurService
{
    protected ArmateurQueryService $queryService;

    public function __construct(ArmateurQueryService $queryService)
    {
        $this->queryService = $queryService;
    }

    /**
     * Récupérer tous les armateurs avec filtres (paginé)
     */
    public function getAllArmateurs(array $filters = []): array
    {
        $perPage = $filters['per_page'] ?? 15;
        $result = $this->queryService->getPaginated($filters, $perPage);
        
        return [
            'data' => $result->items(),
            'meta' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
            ],
            'links' => [
                'first' => $result->url(1),
                'last' => $result->url($result->lastPage()),
                'prev' => $result->previousPageUrl(),
                'next' => $result->nextPageUrl(),
            ]
        ];
    }

    /**
     * Obtenir les armateurs pour les sélections
     */
    public function getArmateursPourSelection(): array
    {
        return $this->queryService->getOptions();
    }

    /**
     * Créer un nouvel armateur
     */
    public function createArmateur(array $data): Armateur
    {
        return Armateur::create($data);
    }

    /**
     * Mettre à jour un armateur
     */
    public function updateArmateur(Armateur $armateur, array $data): Armateur
    {
        $armateur->update($data);
        return $armateur->fresh();
    }

    /**
     * Supprimer un armateur
     */
    public function deleteArmateur(Armateur $armateur): bool
    {
        return $armateur->delete();
    }

    /**
     * Statistiques de détention pour un armateur
     */
    public function getDetentionStats(Armateur $armateur): array
    {
        $baseQuery = fn() => Detention::whereHas('sortieConteneur', fn($q) => 
            $q->where('code_armateur', $armateur->code)
        );

        return [
            'total_detentions' => $baseQuery()->count(),
            'detention_active' => $baseQuery()->where('statut', 'active')->count(),
            'total_montant' => round($baseQuery()->sum('cout_total') ?? 0, 2),
            'moyenne_jours' => round($baseQuery()->avg('jours_detention') ?? 0, 1),
            'derniere_detention' => $baseQuery()->latest('created_at')->first()?->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Statistiques générales d'un armateur
     */
    public function getArmateurStats(Armateur $armateur): array
    {
        $totalSorties = $armateur->sorties()->count();
        $sortiesTerminees = $armateur->sorties()->whereNotNull('date_retour')->count();

        return [
            'total_sorties' => $totalSorties,
            'sorties_actives' => $armateur->sorties()->whereNull('date_retour')->count(),
            'sorties_terminees' => $sortiesTerminees,
            'taux_retour' => $totalSorties > 0 ? round(($sortiesTerminees / $totalSorties) * 100, 1) : 0,
        ];
    }
}