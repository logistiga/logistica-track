<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Models\Vehicule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SortieConteneurService
{
    /**
     * Récupérer toutes les sorties avec filtres
     */
    public function getAllSorties(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque']);

        // Filtres
        if (isset($filters['statut']) && $filters['statut'] !== 'tous') {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        if (isset($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (isset($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('numero_bl', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%")
                  ->orWhere('nom_transitaire', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        
        return $query->orderBy('date_sortie', 'desc')->paginate($perPage);
    }

    /**
     * Créer une nouvelle sortie
     */
    public function createSortie(array $data)
    {
        DB::beginTransaction();

        try {
            // Vérifier la disponibilité des véhicules
            $this->checkVehiculeDisponibilite($data['camion_id'], $data['remorque_id']);

            // Créer la sortie
            $sortie = SortieConteneur::create([
                ...$data,
                // 'created_by' => Auth::id(), // Temporairement désactivé
                'statut' => $data['destination'] === 'base' ? 'a_la_base' : 'livre_client',
                'date_sortie' => $data['date_sortie'] ?? now()->format('Y-m-d'),
            ]);

            // Mettre à jour le statut des véhicules
            $this->updateVehiculeStatut($data['camion_id'], 'en_mission');
            $this->updateVehiculeStatut($data['remorque_id'], 'en_mission');

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Mettre à jour une sortie
     */
    public function updateSortie(SortieConteneur $sortie, array $data)
    {
        DB::beginTransaction();

        try {
            // Si changement de véhicules, vérifier la disponibilité
            if (isset($data['camion_id']) && $data['camion_id'] !== $sortie->camion_id) {
                $this->checkVehiculeDisponibilite($data['camion_id']);
                $this->updateVehiculeStatut($sortie->camion_id, 'disponible');
                $this->updateVehiculeStatut($data['camion_id'], 'en_mission');
            }

            if (isset($data['remorque_id']) && $data['remorque_id'] !== $sortie->remorque_id) {
                $this->checkVehiculeDisponibilite($data['remorque_id']);
                $this->updateVehiculeStatut($sortie->remorque_id, 'disponible');
                $this->updateVehiculeStatut($data['remorque_id'], 'en_mission');
            }

            $sortie->update([
                ...$data,
                // 'updated_by' => Auth::id(), // Temporairement désactivé
            ]);

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Supprimer une sortie
     */
    public function deleteSortie(SortieConteneur $sortie)
    {
        DB::beginTransaction();

        try {
            // Libérer les véhicules si la sortie n'est pas terminée
            if ($sortie->statut !== 'retourne_port') {
                $this->updateVehiculeStatut($sortie->camion_id, 'disponible');
                $this->updateVehiculeStatut($sortie->remorque_id, 'disponible');
            }

            $sortie->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Confirmer le retour d'un conteneur
     */
    public function confirmerRetour(SortieConteneur $sortie, array $data)
    {
        DB::beginTransaction();

        try {
            // Vérifier la disponibilité des véhicules de retour
            $this->checkVehiculeDisponibilite($data['camion_retour_id'], $data['remorque_retour_id']);

            $sortie->update([
                'date_retour' => $data['date_retour'],
                'camion_retour_id' => $data['camion_retour_id'],
                'remorque_retour_id' => $data['remorque_retour_id'],
                'observations' => $data['observations'] ?? null,
                'statut' => 'retourne_port',
                // 'updated_by' => Auth::id(), // Temporairement désactivé
            ]);

            // Libérer les véhicules de sortie
            $this->updateVehiculeStatut($sortie->camion_id, 'disponible');
            $this->updateVehiculeStatut($sortie->remorque_id, 'disponible');

            // Occuper les véhicules de retour
            $this->updateVehiculeStatut($data['camion_retour_id'], 'en_mission');
            $this->updateVehiculeStatut($data['remorque_retour_id'], 'en_mission');

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Obtenir les statistiques
     */
    public function getStatistiques(array $filters = [])
    {
        $today = now()->format('Y-m-d');
        $currentMonth = now()->month;
        $currentYear = now()->year;

        return [
            'conteneurs_hors_port' => SortieConteneur::enCours()->count(),
            'sorties_aujourdhui' => SortieConteneur::whereDate('date_sortie', $today)->count(),
            'sorties_mois' => SortieConteneur::parMois($currentYear, $currentMonth)->count(),
            'retours_mois' => SortieConteneur::whereNotNull('date_retour')
                ->whereYear('date_retour', $currentYear)
                ->whereMonth('date_retour', $currentMonth)
                ->count(),
            'total_sorties' => SortieConteneur::count(),
            'vehicules_disponibles' => Vehicule::disponibles()->count(),
        ];
    }

    /**
     * Vérifier la disponibilité d'un ou plusieurs véhicules
     */
    private function checkVehiculeDisponibilite(...$vehiculeIds)
    {
        foreach ($vehiculeIds as $vehiculeId) {
            if ($vehiculeId) {
                $vehicule = Vehicule::find($vehiculeId);
                if (!$vehicule || $vehicule->statut !== 'disponible') {
                    throw new \Exception("Le véhicule {$vehicule->numero_parc} n'est pas disponible");
                }
            }
        }
    }

    /**
     * Mettre à jour le statut d'un véhicule
     */
    private function updateVehiculeStatut($vehiculeId, $statut)
    {
        if ($vehiculeId) {
            Vehicule::where('id', $vehiculeId)->update(['statut' => $statut]);
        }
    }
}