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

        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_parc', 'like', "%{$search}%")
                  ->orWhere('immatriculation', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%")
                  ->orWhere('modele', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        
        return $query->orderBy('numero_parc')->paginate($perPage);
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
     * Récupérer les remorques
     */
    public function getRemorques(array $filters = [])
    {
        $filters['type'] = 'remorque';
        return $this->getAllVehicules($filters);
    }

    /**
     * Récupérer les véhicules disponibles
     */
    public function getVehiculesDisponibles()
    {
        return Vehicule::disponibles()
            ->orderBy('type')
            ->orderBy('numero_parc')
            ->get()
            ->groupBy('type');
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
        // Vérifier s'il y a des sorties en cours
        if ($vehicule->sortiesCommeAttele()->enCours()->exists() || 
            $vehicule->sortiesCommeRemorque()->enCours()->exists()) {
            throw new \Exception('Impossible de supprimer ce véhicule car il est utilisé dans des sorties en cours');
        }

        $vehicule->delete();
    }

    /**
     * Obtenir les camions disponibles pour les sélections
     */
    public function getCamionsPourSelection()
    {
        return Vehicule::camions()
            ->disponibles()
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
            ->disponibles()
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