<?php

namespace App\Services;

use App\Models\DoubleRelevage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class DoubleRelevageService
{
    /**
     * Récupérer les opérations avec filtres et pagination
     */
    public function getDoubleRelevages(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = DoubleRelevage::with(['createdBy', 'updatedBy']);

        // Appliquer les filtres
        $this->applyFilters($query, $filters);

        return $query->orderBy('date_creation', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Créer une nouvelle opération de double relevage
     */
    public function createDoubleRelevage(array $data, int $userId): DoubleRelevage
    {
        $data['created_by'] = $userId;
        $data['date_creation'] = now()->toDateString();
        $data['statut'] = 'en_attente';

        return DoubleRelevage::create($data);
    }

    /**
     * Mettre à jour une opération
     */
    public function updateDoubleRelevage(DoubleRelevage $doubleRelevage, array $data, int $userId): DoubleRelevage
    {
        $data['updated_by'] = $userId;
        
        $doubleRelevage->update($data);
        
        return $doubleRelevage->fresh(['createdBy', 'updatedBy']);
    }

    /**
     * Confirmer une opération
     */
    public function confirmerDoubleRelevage(DoubleRelevage $doubleRelevage, int $userId): DoubleRelevage
    {
        $doubleRelevage->update([
            'statut' => 'confirme',
            'date_confirmation' => now()->toDateString(),
            'updated_by' => $userId
        ]);

        return $doubleRelevage->fresh(['createdBy', 'updatedBy']);
    }

    /**
     * Récupérer les statistiques
     */
    public function getStats(): array
    {
        return [
            'total_en_attente' => DoubleRelevage::where('statut', 'en_attente')->count(),
            'total_confirmees' => DoubleRelevage::where('statut', 'confirme')->count(),
            'operations_aujourdhui' => DoubleRelevage::whereDate('date_creation', today())->count(),
            'montant_mensuel' => DoubleRelevage::where('statut', 'confirme')
                                              ->whereMonth('date_confirmation', now()->month)
                                              ->whereYear('date_confirmation', now()->year)
                                              ->sum('montant_operation'),
        ];
    }

    /**
     * Récupérer les opérations en attente
     */
    public function getDoubleRelevagesEnAttente()
    {
        return DoubleRelevage::enAttente()
                           ->with(['createdBy', 'updatedBy'])
                           ->orderBy('date_creation', 'desc')
                           ->get();
    }

    /**
     * Appliquer les filtres à la requête
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%")
                  ->orWhere('provenance', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['date_debut'])) {
            $query->whereDate('date_creation', '>=', $filters['date_debut']);
        }

        if (!empty($filters['date_fin'])) {
            $query->whereDate('date_creation', '<=', $filters['date_fin']);
        }
    }
}