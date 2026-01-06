<?php

namespace App\Services;

use App\Models\Armateur;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Service centralisé pour les requêtes armateurs
 */
class ArmateurQueryService
{
    /**
     * Construire une requête de base avec filtres
     */
    public function buildQuery(array $filters = []): Builder
    {
        $query = Armateur::query();

        if (isset($filters['actif'])) {
            $query->where('actif', filter_var($filters['actif'], FILTER_VALIDATE_BOOLEAN));
        } else {
            // Par défaut, seulement les actifs
            $query->where('actif', true);
        }

        if (isset($filters['type_conteneur'])) {
            $query->where('type_conteneur', $filters['type_conteneur']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('type_conteneur', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('nom');
    }

    /**
     * Récupérer tous les armateurs
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->buildQuery($filters)->get();
    }

    /**
     * Récupérer avec pagination
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->buildQuery($filters)->paginate($perPage);
    }

    /**
     * Recherche d'armateurs
     */
    public function search(string $query, array $filters = []): Collection
    {
        $filters['search'] = $query;
        return $this->getAll($filters);
    }

    /**
     * Récupérer par type de conteneur
     */
    public function getByTypeConteneur(string $type, array $filters = []): Collection
    {
        $filters['type_conteneur'] = $type;
        return $this->getAll($filters);
    }

    /**
     * Options pour sélection
     */
    public function getOptions(): array
    {
        return Armateur::actifs()
            ->orderBy('nom')
            ->get()
            ->map(fn($a) => [
                'value' => $a->code,
                'label' => "{$a->code} - {$a->nom} ({$a->type_conteneur})"
            ])
            ->toArray();
    }

    /**
     * Trouver par code
     */
    public function findByCode(string $code): ?Armateur
    {
        return Armateur::where('code', $code)->first();
    }
}
