<?php

namespace App\Services;

use App\Models\Vehicule;
use App\Exceptions\VehiculeNotAvailableException;

class VehiculeManagementService
{
    /**
     * Vérifier la disponibilité d'un ou plusieurs véhicules
     */
    public function checkVehiculeDisponibilite(...$vehiculeIds)
    {
        foreach ($vehiculeIds as $vehiculeId) {
            if (!$vehiculeId) continue;

            $vehicule = Vehicule::find($vehiculeId);
            
            if (!$vehicule) {
                throw new \Exception("Véhicule {$vehiculeId} non trouvé");
            }

            if (!$vehicule->actif) {
                throw new VehiculeNotAvailableException("Le véhicule {$vehicule->numero_parc} n'est pas actif");
            }

            if ($vehicule->statut !== 'disponible') {
                throw new VehiculeNotAvailableException("Le véhicule {$vehicule->numero_parc} n'est pas disponible (statut: {$vehicule->statut})");
            }
        }
    }

    /**
     * Mettre à jour le statut d'un véhicule
     */
    public function updateVehiculeStatut($vehiculeId, string $statut)
    {
        if (!$vehiculeId) return;

        $vehicule = Vehicule::find($vehiculeId);
        
        if ($vehicule) {
            $vehicule->update(['statut' => $statut]);
            \Log::info("Véhicule {$vehicule->numero_parc} - Statut mis à jour: {$statut}");
        }
    }

    /**
     * Libérer tous les véhicules d'une sortie
     */
    public function libererVehiculesSortie($camionId, $remorqueId)
    {
        $this->updateVehiculeStatut($camionId, 'disponible');
        $this->updateVehiculeStatut($remorqueId, 'disponible');
    }

    /**
     * Occuper les véhicules pour une mission
     */
    public function occuperVehicules($camionId, $remorqueId)
    {
        $this->updateVehiculeStatut($camionId, 'en_mission');
        $this->updateVehiculeStatut($remorqueId, 'en_mission');
    }
}