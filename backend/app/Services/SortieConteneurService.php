<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Models\Vehicule;
use Illuminate\Support\Facades\DB;

class SortieConteneurService
{
    protected SortieQueryService $queryService;
    protected SortieCreationService $creationService;
    protected SortieStatisticsService $statisticsService;
    protected VehiculeManagementService $vehiculeService;
    protected DetentionCalculatorService $detentionCalculator;

    public function __construct(
        SortieQueryService $queryService,
        SortieCreationService $creationService,
        SortieStatisticsService $statisticsService,
        VehiculeManagementService $vehiculeService,
        DetentionCalculatorService $detentionCalculator
    ) {
        $this->queryService = $queryService;
        $this->creationService = $creationService;
        $this->statisticsService = $statisticsService;
        $this->vehiculeService = $vehiculeService;
        $this->detentionCalculator = $detentionCalculator;
    }

    public function getAllSorties(array $filters = [])
    {
        return $this->queryService->getAllSorties($filters);
    }

    public function createSortie(array $data)
    {
        return $this->creationService->createSortie($data);
    }

    public function updateSortie(SortieConteneur $sortie, array $data)
    {
        return $this->creationService->updateSortie($sortie, $data);
    }

    public function deleteSortie(SortieConteneur $sortie)
    {
        return $this->creationService->deleteSortie($sortie);
    }

    /**
     * Confirmer le retour d'un conteneur
     */
    public function confirmerRetour(SortieConteneur $sortie, array $data)
    {
        DB::beginTransaction();

        try {
            $this->checkVehiculeDisponibilite($data['camion_retour_id'], $data['remorque_retour_id']);

            $sortie->update([
                'date_retour' => $data['date_retour'],
                'camion_retour_id' => $data['camion_retour_id'],
                'remorque_retour_id' => $data['remorque_retour_id'],
                'observations' => $data['observations'] ?? null,
                'statut' => 'retourne_port',
            ]);

            // Libérer les véhicules de sortie
            $this->updateVehiculeStatut($sortie->camion_id, 'disponible');
            $this->updateVehiculeStatut($sortie->remorque_id, 'disponible');

            // Occuper les véhicules de retour
            $this->updateVehiculeStatut($data['camion_retour_id'], 'en_mission');
            $this->updateVehiculeStatut($data['remorque_retour_id'], 'en_mission');

            // Créer automatiquement la détention si dépassement (via le calculator centralisé)
            $this->detentionCalculator->creerDetentionSiNecessaire($sortie);

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function getStatistics(array $filters = [])
    {
        return $this->statisticsService->getStatistics($filters);
    }

    public function getSortiesEnCours(array $filters = [])
    {
        return $this->queryService->getSortiesEnCours($filters);
    }

    public function getSortiesRetournees(array $filters = [])
    {
        return $this->queryService->getSortiesRetournees($filters);
    }

    /**
     * Vérifier la disponibilité des véhicules
     */
    private function checkVehiculeDisponibilite($camionId = null, $remorqueId = null)
    {
        if ($camionId && !Vehicule::find($camionId)) {
            throw new \Exception("Camion introuvable (ID: {$camionId})");
        }

        if ($remorqueId && !Vehicule::find($remorqueId)) {
            throw new \Exception("Remorque introuvable (ID: {$remorqueId})");
        }
    }

    /**
     * Mettre à jour le statut d'un véhicule
     */
    private function updateVehiculeStatut($vehiculeId, $statut)
    {
        if (!$vehiculeId) {
            return;
        }

        try {
            Vehicule::where('id', $vehiculeId)->update(['statut' => $statut]);
        } catch (\Exception $e) {
            \Log::warning("Impossible de mettre à jour le statut du véhicule {$vehiculeId}: " . $e->getMessage());
        }
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
                $results[] = $this->confirmerRetour($sortie, [
                    'date_retour' => now()->format('Y-m-d'),
                    'camion_retour_id' => $sortieData['camion_retour_id'],
                    'remorque_retour_id' => $sortieData['remorque_retour_id'],
                    'observations' => $sortieData['observations'] ?? null,
                ]);
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
        return $this->detentionCalculator->getDetailsCalcul($sortie);
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
}