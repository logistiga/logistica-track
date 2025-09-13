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
    protected DetentionCalculationService $detentionService;

    public function __construct(
        SortieQueryService $queryService,
        SortieCreationService $creationService,
        SortieStatisticsService $statisticsService,
        VehiculeManagementService $vehiculeService,
        DetentionCalculationService $detentionService
    ) {
        $this->queryService = $queryService;
        $this->creationService = $creationService;
        $this->statisticsService = $statisticsService;
        $this->vehiculeService = $vehiculeService;
        $this->detentionService = $detentionService;
    }
    // Déléguer aux services spécialisés
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

            // Calculer automatiquement la détention si dépassement
            $this->calculerDetentionApresRetour($sortie);

            DB::commit();

            return $sortie->load(['armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour']);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Calculer et créer automatiquement une détention après retour si dépassement
     */
    private function calculerDetentionApresRetour(SortieConteneur $sortie): void
    {
        \Log::info('🔍 Calculating detention for sortie:', [
            'sortie_id' => $sortie->id,
            'numero_conteneur' => $sortie->numero_conteneur,
            'date_sortie' => $sortie->date_sortie,
            'date_retour' => $sortie->date_retour,
            'jours_bad' => $sortie->jours_bad,
            'type_destination' => $sortie->type_destination
        ]);

        // Vérifier que les données nécessaires sont disponibles
        if (!$sortie->date_sortie || !$sortie->date_retour) {
            \Log::warning('❌ Missing required dates for detention calculation');
            return;
        }

        // Calculer les jours réels hors port
        $joursReels = $sortie->date_sortie->diffInDays($sortie->date_retour);
        
        // Déterminer les jours autorisés selon le type de destination
        $joursAutorises = $this->determinerJoursAutorises($sortie);

        \Log::info('📊 Detention calculation details:', [
            'jours_reels' => $joursReels,
            'jours_autorises' => $joursAutorises,
            'depassement' => $joursReels - $joursAutorises
        ]);

        // Vérifier s'il y a dépassement
        if ($joursReels <= $joursAutorises) {
            \Log::info('✅ No detention needed - within authorized period');
            return; // Pas de dépassement, pas de détention
        }

        // Calculer les jours de dépassement
        $joursDepassement = $joursReels - $joursAutorises;

        // Vérifier qu'une détention n'existe pas déjà
        $detentionExistante = \App\Models\Detention::where('sortie_conteneur_id', $sortie->id)->first();
        if ($detentionExistante) {
            \Log::info('ℹ️ Detention already exists for this sortie:', ['detention_id' => $detentionExistante->id]);
            return;
        }

        // Tarif par défaut en FCFA (à configurer par armateur si nécessaire)
        $coutParJour = $this->getCoutDetentionParJour($sortie);

        // Calculer le coût total
        $coutTotal = $joursDepassement * $coutParJour;

        // Créer la détention automatiquement
        try {
            $detention = \App\Models\Detention::create([
                'sortie_conteneur_id' => $sortie->id,
                'date_debut_detention' => $sortie->date_sortie->copy()->addDays($joursAutorises),
                'date_fin_detention' => $sortie->date_retour,
                'jours_detention' => $joursDepassement,
                'cout_par_jour' => $coutParJour,
                'cout_total' => $coutTotal,
                'responsabilite' => null, // Sera défini par l'utilisateur
                'motif_detention' => "Dépassement de franchise de {$joursDepassement} jour(s)",
                'statut' => 'active',
                'observations' => "Détention créée automatiquement lors du retour du conteneur {$sortie->numero_conteneur}",
            ]);

            \Log::info('✅ Detention created automatically:', [
                'detention_id' => $detention->id,
                'sortie_id' => $sortie->id,
                'jours_depassement' => $joursDepassement,
                'cout_total' => $detention->cout_total
            ]);
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas faire échouer la confirmation de retour
            \Log::error('❌ Error creating automatic detention:', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Déterminer les jours autorisés selon le type de destination
     */
    private function determinerJoursAutorises(SortieConteneur $sortie): int
    {
        // Si jours_bad est défini, l'utiliser
        if ($sortie->jours_bad && $sortie->jours_bad > 0) {
            return $sortie->jours_bad;
        }

        // Sinon, déterminer selon le type de destination
        switch ($sortie->type_destination) {
            case 'detention':
                return 0; // Pas de franchise pour les conteneurs déjà en détention
            case 'bad':
                return 2; // 2 jours de franchise pour BAD
            case 'depot':
                return 7; // 7 jours de franchise pour dépôt
            case 'client':
            default:
                return 5; // 5 jours de franchise par défaut pour livraison client
        }
    }

    /**
     * Obtenir le coût de détention par jour selon l'armateur
     */
    private function getCoutDetentionParJour(SortieConteneur $sortie): float
    {
        // Utiliser le prix_par_jour de l'armateur si disponible
        if ($sortie->armateur && $sortie->armateur->prix_par_jour) {
            return (float) $sortie->armateur->prix_par_jour;
        }

        // Sinon utiliser le tarif de fallback de la configuration
        $tarifs = config('detention.tarifs_par_jour', ['default' => 15000]);
        return $tarifs['default'];
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
            return $sortie->date_sortie->diffInDays($sortie->date_retour);
        });

        return round($totalJours / $sorties->count(), 1);
    }

    /**
     * Vérifier la disponibilité des véhicules
     */
    private function checkVehiculeDisponibilite($camionId = null, $remorqueId = null)
    {
        if ($camionId) {
            $camion = Vehicule::find($camionId);
            if (!$camion) {
                throw new \Exception("Camion introuvable (ID: {$camionId})");
            }
            // Note: La vérification du statut est désactivée pour le moment
            // car tous les véhicules sont marqués comme 'disponible' par défaut
        }

        if ($remorqueId) {
            $remorque = Vehicule::find($remorqueId);
            if (!$remorque) {
                throw new \Exception("Remorque introuvable (ID: {$remorqueId})");
            }
            // Note: La vérification du statut est désactivée pour le moment
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
            // Ne pas faire échouer l'opération principale si la mise à jour du statut échoue
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
}