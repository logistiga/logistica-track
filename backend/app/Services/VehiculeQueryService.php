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

        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
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
     * Récupérer par statut
     */
    public function getByStatut(string $statut, array $filters = []): Collection
    {
        $filters['statut'] = $statut;
        return $this->getAll($filters);
    }

    /**
     * Véhicules disponibles
     */
    public function getDisponibles(?string $type = null): Collection
    {
        $filters = ['statut' => 'disponible', 'actif' => true];
        
        if ($type) {
            $filters['type'] = $type;
        }
        
        return $this->getAll($filters);
    }

    /**
     * Véhicules en mission
     */
    public function getEnMission(array $filters = []): Collection
    {
        $filters['statut'] = 'en_mission';
        return $this->getAll($filters);
    }

    /**
     * Véhicules en maintenance
     */
    public function getEnMaintenance(array $filters = []): Collection
    {
        $filters['statut'] = 'maintenance';
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
     * Options pour sélection (camions)
     */
    public function getCamionsOptions(): array
    {
        return Vehicule::camions()
            ->actifs()
            ->orderBy('numero_parc')
            ->get()
            ->map(fn($v) => ['value' => $v->id, 'label' => $v->libelle_complet])
            ->toArray();
    }

    /**
     * Options pour sélection (remorques)
     */
    public function getRemorquesOptions(): array
    {
        return Vehicule::remorques()
            ->actifs()
            ->orderBy('numero_parc')
            ->get()
            ->map(fn($v) => ['value' => $v->id, 'label' => $v->libelle_complet])
            ->toArray();
    }
}
