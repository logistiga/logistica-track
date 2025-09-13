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

            // Note: On ne vérifie plus le statut car la colonne n'existe pas encore
            // TODO: Ajouter une colonne statut à la table vehicules si nécessaire
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
            // Note: On ne met pas à jour le statut car la colonne n'existe pas encore
            // TODO: Ajouter une colonne statut à la table vehicules si nécessaire
            \Log::info("Véhicule {$vehicule->numero_parc} - Statut demandé: {$statut} (non mis à jour - colonne manquante)");
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