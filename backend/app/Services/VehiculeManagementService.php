<?php

namespace App\Services;

use App\Models\Vehicule;
use App\Exceptions\VehiculeNotAvailableException;

class VehiculeManagementService
{
    /**
     * Vérifier que les véhicules existent et sont actifs
     */
    public function checkVehiculeDisponibilite(...$vehiculeIds): void
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
        }
    }
}