<?php

namespace App\Services;

use App\Models\Vehicule;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

/**
 * Service centralisé pour les requêtes véhicules
 */
class VehiculeQueryService
{
    /**
     * Construire une requête de base avec filtres
     */
    public function buildQuery(array $filters = []): Builder
    {
        $query = Vehicule::query();

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['actif'])) {
            $query->where('actif', filter_var($filters['actif'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_parc', 'like', "%{$search}%")
                  ->orWhere('immatriculation', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('numero_parc');
    }

    /**
     * Récupérer tous les véhicules avec filtres
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->buildQuery($filters)->get();
    }

    /**
     * Récupérer par type
     */
    public function getByType(string $type, array $filters = []): Collection
    {
        $filters['type'] = $type;
        return $this->getAll($filters);
    }

    /**
     * Recherche de véhicules
     */
    public function search(string $query, array $filters = []): Collection
    {
        $filters['search'] = $query;
        return $this->getAll($filters);
    }

    /**
     * Options pour sélection (camions) - sans scopes, direct et sûr
     */
    public function getCamionsOptions(): array
    {
        return Vehicule::where('type', 'camion')
            ->where('actif', true)
            ->orderBy('numero_parc')
            ->get()
            ->map(fn($v) => [
                'value' => $v->id, 
                'label' => $v->numero_parc . ' - ' . $v->immatriculation
            ])
            ->toArray();
    }

    /**
     * Options pour sélection (remorques) - sans scopes, direct et sûr
     */
    public function getRemorquesOptions(): array
    {
        return Vehicule::where('type', 'remorque')
            ->where('actif', true)
            ->orderBy('numero_parc')
            ->get()
            ->map(fn($v) => [
                'value' => $v->id, 
                'label' => $v->numero_parc . ' - ' . $v->immatriculation
            ])
            ->toArray();
    }
}
