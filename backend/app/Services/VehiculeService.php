<?php

namespace App\Services;

use App\Models\Vehicule;

class VehiculeService
{
    /**
     * Récupérer tous les véhicules avec filtres
     */
    public function getAllVehicules(array $filters = [])
    {
        $query = Vehicule::query();

        // Filtres
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_parc', 'like', "%{$search}%")
                  ->orWhere('immatriculation', 'like', "%{$search}%");
            });
        }

        $result = $query->orderBy('numero_parc')->get();
        
        return [
            'data' => $result,
            'meta' => [
                'total' => $result->count(),
            ],
        ];
    }

    /**
     * Récupérer les camions
     */
    public function getCamions(array $filters = [])
    {
        $filters['type'] = 'camion';
        return $this->getAllVehicules($filters);
    }

    /**
     * Créer un nouveau véhicule
     */
    public function createVehicule(array $data)
    {
        return Vehicule::create($data);
    }

    /**
     * Mettre à jour un véhicule
     */
    public function updateVehicule(Vehicule $vehicule, array $data)
    {
        $vehicule->update($data);
        return $vehicule;
    }

    /**
     * Supprimer un véhicule
     */
    public function deleteVehicule(Vehicule $vehicule)
    {
        $vehicule->delete();
    }

    /**
     * Récupérer les remorques
     */
    public function getRemorques(array $filters = [])
    {
        $filters['type'] = 'remorque';
        return $this->getAllVehicules($filters);
    }

    /**
     * Obtenir les camions disponibles pour les sélections
     */
    public function getCamionsPourSelection()
    {
        return Vehicule::camions()
            ->actifs()
            ->select('id', 'numero_parc', 'immatriculation')
            ->orderBy('numero_parc')
            ->get()
            ->map(function ($camion) {
                return [
                    'value' => $camion->id,
                    'label' => $camion->libelle_complet
                ];
            });
    }

    /**
     * Obtenir les remorques disponibles pour les sélections
     */
    public function getRemorquesPourSelection()
    {
        return Vehicule::remorques()
            ->actifs()
            ->select('id', 'numero_parc', 'immatriculation')
            ->orderBy('numero_parc')
            ->get()
            ->map(function ($remorque) {
                return [
                    'value' => $remorque->id,
                    'label' => $remorque->libelle_complet
                ];
            });
    }
}