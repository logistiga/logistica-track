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
        
        $paginatedResult = $query->orderBy('date_sortie', 'desc')->paginate($perPage);
        
        // Retourner dans le format attendu par le controller
        return [
            'data' => $paginatedResult->items(),
            'meta' => [
                'current_page' => $paginatedResult->currentPage(),
                'last_page' => $paginatedResult->lastPage(),
                'per_page' => $paginatedResult->perPage(),
                'total' => $paginatedResult->total(),
            ],
            'links' => [
                'first' => $paginatedResult->url(1),
                'last' => $paginatedResult->url($paginatedResult->lastPage()),
                'prev' => $paginatedResult->previousPageUrl(),
                'next' => $paginatedResult->nextPageUrl(),
            ]
        ];
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
    public function getStatistics(array $filters = [])
    {
        $query = SortieConteneur::query();
        
        // Appliquer les filtres si fournis
        if (!empty($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (!empty($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        if (!empty($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        $today = now()->format('Y-m-d');
        $currentMonth = now()->month;
        $currentYear = now()->year;

        return [
            'total_sorties' => $query->count(),
            'sorties_en_cours' => (clone $query)->where('statut', 'en_cours')->count(),
            'sorties_retournees' => (clone $query)->where('statut', 'retourne_port')->count(),
            'sorties_livrees' => (clone $query)->where('statut', 'livre_client')->count(),
            'sorties_base' => (clone $query)->where('statut', 'a_la_base')->count(),
            'conteneurs_hors_port' => SortieConteneur::enCours()->count(),
            'sorties_aujourdhui' => SortieConteneur::whereDate('date_sortie', $today)->count(),
            'sorties_mois' => SortieConteneur::parMois($currentYear, $currentMonth)->count(),
            'retours_mois' => SortieConteneur::whereNotNull('date_retour')
                ->whereYear('date_retour', $currentYear)
                ->whereMonth('date_retour', $currentMonth)
                ->count(),
            'vehicules_disponibles' => Vehicule::where('statut', 'disponible')->count(),
            'vehicules_en_mission' => Vehicule::where('statut', 'en_mission')->count(),
            'moyenne_jours_hors_port' => $this->calculateAverageJoursHorsPort($filters),
            'total_prime_chauffeur' => (clone $query)->sum('prime_chauffeur'),
        ];
    }

    public function getSortiesEnCours(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque'])
            ->where('statut', 'en_cours');

        // Appliquer les mêmes filtres que getAllSorties
        if (!empty($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('numero_bl', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('date_sortie', 'desc')->get();
    }

    public function getSortiesRetournees(array $filters = [])
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour'])
            ->where('statut', 'retourne_port');

        // Appliquer les mêmes filtres
        if (!empty($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('numero_bl', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('date_retour', 'desc')->get();
    }

    private function calculateAverageJoursHorsPort(array $filters = [])
    {
        $query = SortieConteneur::where('statut', 'retourne_port');
        
        if (!empty($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (!empty($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        $sorties = $query->get();
        
        if ($sorties->isEmpty()) {
            return 0;
        }

        $totalJours = $sorties->sum(function ($sortie) {
            return $sortie->jours_hors_port;
        });

        return round($totalJours / $sorties->count(), 1);
    }

    public function searchSorties(string $query, array $filters = [])
    {
        $searchQuery = SortieConteneur::with(['armateur', 'camion', 'remorque'])
            ->where(function ($q) use ($query) {
                $q->where('numero_conteneur', 'like', "%{$query}%")
                  ->orWhere('numero_bl', 'like', "%{$query}%")
                  ->orWhere('nom_client', 'like', "%{$query}%")
                  ->orWhere('nom_transitaire', 'like', "%{$query}%");
            });

        // Appliquer les filtres additionnels
        if (!empty($filters['statut'])) {
            $searchQuery->where('statut', $filters['statut']);
        }

        if (!empty($filters['code_armateur'])) {
            $searchQuery->where('code_armateur', $filters['code_armateur']);
        }

        return $searchQuery->orderBy('date_sortie', 'desc')->limit(50)->get();
    }

    public function bulkReturn(array $sortiesData)
    {
        $results = [];
        
        foreach ($sortiesData as $sortieData) {
            $sortie = SortieConteneur::findOrFail($sortieData['id']);
            
            if ($sortie->statut === 'en_cours') {
                $returnData = [
                    'date_retour' => now()->format('Y-m-d'),
                    'camion_retour_id' => $sortieData['camion_retour_id'],
                    'remorque_retour_id' => $sortieData['remorque_retour_id'],
                    'observations' => $sortieData['observations'] ?? null,
                ];
                
                $results[] = $this->confirmerRetour($sortie, $returnData);
            }
        }
        
        return $results;
    }

    public function getTimeline(SortieConteneur $sortie)
    {
        $timeline = [
            [
                'date' => $sortie->date_sortie,
                'type' => 'sortie',
                'title' => 'Sortie du port',
                'description' => "Conteneur {$sortie->numero_conteneur} sorti du port",
                'user' => $sortie->createdBy->name ?? 'Système',
            ]
        ];

        if ($sortie->date_retour) {
            $timeline[] = [
                'date' => $sortie->date_retour,
                'type' => 'retour',
                'title' => 'Retour au port',
                'description' => "Conteneur retourné au port",
                'user' => $sortie->updatedBy->name ?? 'Système',
            ];
        }

        return $timeline;
    }

    public function getDetentionInfo(SortieConteneur $sortie)
    {
        $info = [
            'jours_hors_port' => $sortie->jours_hors_port,
            'jours_bad' => $sortie->jours_bad,
            'date_fin_franchise' => $sortie->date_fin_franchise,
            'franchise_expiree' => false,
            'jours_detention' => 0,
        ];

        if ($sortie->date_fin_franchise) {
            $info['franchise_expiree'] = now()->gt($sortie->date_fin_franchise);
            
            if ($info['franchise_expiree']) {
                $dateReference = $sortie->date_retour ? $sortie->date_retour : now();
                $info['jours_detention'] = now()->parse($sortie->date_fin_franchise)->diffInDays($dateReference);
            }
        }

        return $info;
    }

    public function getFacturationInfo(SortieConteneur $sortie)
    {
        return [
            'prime_chauffeur' => $sortie->prime_chauffeur,
            'prime_chauffeur_formattee' => number_format($sortie->prime_chauffeur, 0, ',', ' ') . ' XOF',
            'type_destination' => $sortie->type_destination,
            'destination' => $sortie->destination,
            'jours_facturation' => $sortie->jours_hors_port,
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
                if (!$vehicule || !$vehicule->actif) {
                    throw new \Exception("Le véhicule avec l'ID {$vehiculeId} n'est pas disponible");
                }
            }
        }
    }

    /**
     * Mettre à jour le statut d'un véhicule (pour l'instant, on ne fait rien car le modèle n'a pas de statut)
     */
    private function updateVehiculeStatut($vehiculeId, $statut)
    {
        // Pour l'instant, on ne met pas à jour de statut car le modèle Vehicule n'a que le champ 'actif'
        // Cette méthode pourrait être utilisée plus tard si on ajoute un système de statut aux véhicules
    }
}