<?php

namespace App\Services;

use App\Models\Vehicule;
use Illuminate\Database\Eloquent\Collection;

class VehiculeService
{
    protected VehiculeQueryService $queryService;

    public function __construct(VehiculeQueryService $queryService)
    {
        $this->queryService = $queryService;
    }

    /**
     * Récupérer tous les véhicules avec filtres
     */
    public function getAllVehicules(array $filters = []): array
    {
        $result = $this->queryService->getAll($filters);
        
        return [
            'data' => $result,
            'meta' => ['total' => $result->count()],
        ];
    }

    /**
     * Récupérer les camions
     */
    public function getCamions(array $filters = []): Collection
    {
        return $this->queryService->getByType('camion', $filters);
    }

    /**
     * Récupérer les remorques
     */
    public function getRemorques(array $filters = []): Collection
    {
        return $this->queryService->getByType('remorque', $filters);
    }

    /**
     * Véhicules disponibles
     */
    public function getVehiculesDisponibles(?string $type = null): Collection
    {
        return $this->queryService->getDisponibles($type);
    }

    /**
     * Véhicules en mission
     */
    public function getVehiculesEnMission(array $filters = []): Collection
    {
        return $this->queryService->getEnMission($filters);
    }

    /**
     * Véhicules en maintenance
     */
    public function getVehiculesEnMaintenance(array $filters = []): Collection
    {
        return $this->queryService->getEnMaintenance($filters);
    }

    /**
     * Recherche de véhicules
     */
    public function searchVehicules(string $query, array $filters = []): Collection
    {
        return $this->queryService->search($query, $filters);
    }

    /**
     * Créer un nouveau véhicule
     */
    public function createVehicule(array $data): Vehicule
    {
        return Vehicule::create($data);
    }

    /**
     * Mettre à jour un véhicule
     */
    public function updateVehicule(Vehicule $vehicule, array $data): Vehicule
    {
        $vehicule->update($data);
        return $vehicule;
    }

    /**
     * Supprimer un véhicule
     */
    public function deleteVehicule(Vehicule $vehicule): void
    {
        $vehicule->delete();
    }

    /**
     * Options pour sélection (camions)
     */
    public function getCamionsPourSelection(): array
    {
        return $this->queryService->getCamionsOptions();
    }

    /**
     * Options pour sélection (remorques)
     */
    public function getRemorquesPourSelection(): array
    {
        return $this->queryService->getRemorquesOptions();
    }
}