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

        // Pour l'interface de matériel, récupérer tous les véhicules sans pagination
        if (!isset($filters['per_page'])) {
            $result = $query->orderBy('numero_parc')->get();
            
            return [
                'data' => $result,
                'meta' => [
                    'total' => $result->count(),
                ],
            ];
        }

        // Pagination seulement si explicitement demandée
        $perPage = $filters['per_page'];
        $result = $query->orderBy('numero_parc')->paginate($perPage);
        
        return [
            'data' => $result->items(),
            'meta' => [
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total(),
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

    // Ajouter les méthodes manquantes pour compatibilité avec le contrôleur
    public function getVehiculesEnMission(array $filters = [])
    {
        $query = Vehicule::where('statut', 'en_mission');
        
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        return $query->orderBy('numero_parc')->get();
    }

    public function getVehiculesEnMaintenance(array $filters = [])
    {
        $query = Vehicule::where('statut', 'maintenance');
        
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        return $query->orderBy('numero_parc')->get();
    }

    public function searchVehicules($searchQuery, array $filters = [])
    {
        $query = Vehicule::where(function ($q) use ($searchQuery) {
            $q->where('numero_parc', 'like', "%{$searchQuery}%")
              ->orWhere('immatriculation', 'like', "%{$searchQuery}%")
              ->orWhere('marque', 'like', "%{$searchQuery}%")
              ->orWhere('modele', 'like', "%{$searchQuery}%");
        });

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }

        return $query->orderBy('numero_parc')->get();
    }

    public function getVehiculeHistory(Vehicule $vehicule)
    {
        return [
            'missions' => [],
            'maintenances' => [],
            'events' => []
        ];
    }

    public function getMaintenanceSchedule(Vehicule $vehicule)
    {
        return [
            'next_maintenance' => null,
            'scheduled_maintenances' => []
        ];
    }

    public function exportVehicules($format, array $filters = [])
    {
        return [
            'file_url' => '#',
            'file_name' => "vehicules_export.{$format}",
            'generated_at' => now()->toISOString()
        ];
    }
}