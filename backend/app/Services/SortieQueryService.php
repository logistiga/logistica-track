<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\Schema;

class SortieQueryService
{
    /**
     * Récupérer toutes les sorties avec filtres
     */
    public function getAllSorties(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque'])
            ->when(
                Schema::hasColumn((new SortieConteneur())->getTable(), 'archived_at'),
                fn ($q) => $q->whereNull('archived_at')
            );

        $this->applyFilters($query, $filters);

        // Pagination réduite pour performance
        $perPage = $filters['per_page'] ?? 30;
        
        $paginatedResult = $query->orderBy('date_sortie', 'desc')->paginate($perPage);
        
        return [
            'data' => $paginatedResult->items(),
            'meta' => [
                'current_page' => $paginatedResult->currentPage(),
                'last_page' => $paginatedResult->lastPage(),
                'per_page' => $paginatedResult->perPage(),
                'total' => $paginatedResult->total(),
            ],
            'links' => [
                'first' => $paginatedResult->url(1),
                'last' => $paginatedResult->url($paginatedResult->lastPage()),
                'prev' => $paginatedResult->previousPageUrl(),
                'next' => $paginatedResult->nextPageUrl(),
            ]
        ];
    }

    /**
     * Récupérer les sorties en cours
     */
    public function getSortiesEnCours(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque'])
            ->where('statut', 'en_cours')
            ->when(
                Schema::hasColumn((new SortieConteneur())->getTable(), 'archived_at'),
                fn ($q) => $q->whereNull('archived_at')
            );

        $this->applyBasicFilters($query, $filters);

        return $query->orderBy('date_sortie', 'desc')->get();
    }

    /**
     * Récupérer les sorties retournées
     */
    public function getSortiesRetournees(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour'])
            ->where('statut', 'retourne_port')
            ->when(
                Schema::hasColumn((new SortieConteneur())->getTable(), 'archived_at'),
                fn ($q) => $q->whereNull('archived_at')
            );

        $this->applyBasicFilters($query, $filters);

        return $query->orderBy('date_retour', 'desc')->get();
    }

    /**
     * Appliquer les filtres complets à une requête
     */
    private function applyFilters($query, array $filters)
    {
        if (isset($filters['statut']) && $filters['statut'] !== 'tous') {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (isset($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        $this->applyBasicFilters($query, $filters);
    }

    /**
     * Appliquer les filtres de base à une requête
     */
    private function applyBasicFilters($query, array $filters)
    {
        if (isset($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('numero_bl', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%")
                  ->orWhere('nom_transitaire', 'like', "%{$search}%");
            });
        }
    }
}