<?php

namespace App\Services;

use App\Models\Detention;
use App\Models\SortieConteneur;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DetentionService
{
    protected DetentionCalculatorService $calculator;

    public function __construct(DetentionCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * Récupérer toutes les détentions avec filtres
     */
    public function getAllDetentions(array $filters = [])
    {
        try {
            $query = Detention::with(['sortieConteneur.armateur']);
            
            if (isset($filters['statut']) && $filters['statut'] !== 'tous') {
                $query->where('statut', $filters['statut']);
            }

            if (isset($filters['responsabilite'])) {
                $query->where('responsabilite', $filters['responsabilite']);
            }

            if (isset($filters['date_debut'])) {
                $query->whereDate('date_debut_detention', '>=', $filters['date_debut']);
            }

            if (isset($filters['date_fin'])) {
                $query->whereDate('date_debut_detention', '<=', $filters['date_fin']);
            }

            if (isset($filters['search'])) {
                $search = $filters['search'];
                $query->whereHas('sortieConteneur', function ($q) use ($search) {
                    $q->where('numero_conteneur', 'like', "%{$search}%")
                      ->orWhere('nom_client', 'like', "%{$search}%");
                });
            }

            $perPage = $filters['per_page'] ?? 15;
            $paginatedResult = $query->orderBy('date_debut_detention', 'desc')->paginate($perPage);

            return [
                'data' => $paginatedResult->items(),
                'meta' => [
                    'current_page' => $paginatedResult->currentPage(),
                    'per_page' => $paginatedResult->perPage(),
                    'total' => $paginatedResult->total(),
                    'last_page' => $paginatedResult->lastPage(),
                ],
            ];
        } catch (\Exception $e) {
            \Log::error('Database error in DetentionService:', ['error' => $e->getMessage()]);
            return [
                'data' => [],
                'meta' => ['current_page' => 1, 'per_page' => 15, 'total' => 0, 'last_page' => 1],
            ];
        }
    }

    /**
     * Créer une nouvelle détention
     */
    public function createDetention(array $data): Detention
    {
        return DB::transaction(function () use ($data) {
            $dateDebut = Carbon::parse($data['date_debut_detention']);
            $dateFin = isset($data['date_fin_detention']) 
                ? Carbon::parse($data['date_fin_detention']) 
                : now();
            
            $joursDetention = (int) $dateDebut->diffInDays($dateFin);
            $coutTotal = $this->calculator->calculerCoutPourJours($joursDetention, $data['cout_par_jour']);
            
            return Detention::create([
                'sortie_conteneur_id' => $data['sortie_conteneur_id'],
                'date_debut_detention' => $data['date_debut_detention'],
                'date_fin_detention' => $data['date_fin_detention'] ?? null,
                'jours_detention' => $joursDetention,
                'cout_par_jour' => $data['cout_par_jour'],
                'cout_total' => $coutTotal,
                'responsabilite' => $data['responsabilite'],
                'motif_detention' => $data['motif_detention'],
                'statut' => 'active',
                'observations' => $data['observations'] ?? null,
            ])->load('sortieConteneur.armateur');
        });
    }

    /**
     * Mettre à jour une détention
     */
    public function updateDetention(Detention $detention, array $data): Detention
    {
        return DB::transaction(function () use ($detention, $data) {
            if (isset($data['responsabilite']) && $data['responsabilite'] === 'partagee') {
                $recalcul = $this->calculator->recalculerDetention($detention, $data);
                $data = array_merge($data, $recalcul);
            } elseif (isset($data['date_fin_detention']) || isset($data['cout_par_jour'])) {
                $dateDebut = $detention->date_debut_detention;
                $dateFin = isset($data['date_fin_detention']) 
                    ? Carbon::parse($data['date_fin_detention'])
                    : ($detention->date_fin_detention ?? now());
                
                $joursDetention = (int) $dateDebut->diffInDays($dateFin);
                $coutParJour = $data['cout_par_jour'] ?? $detention->cout_par_jour;
                
                $data['jours_detention'] = $joursDetention;
                $data['cout_total'] = $this->calculator->calculerCoutPourJours($joursDetention, $coutParJour);
            }

            $detention->update($data);
            return $detention->load('sortieConteneur.armateur');
        });
    }

    /**
     * Calculer les statistiques des détentions
     */
    public function getDetentionStats(array $filters = []): array
    {
        $baseQuery = Detention::query();

        if (isset($filters['date_debut'])) {
            $baseQuery->whereDate('date_debut_detention', '>=', $filters['date_debut']);
        }
        if (isset($filters['date_fin'])) {
            $baseQuery->whereDate('date_debut_detention', '<=', $filters['date_fin']);
        }

        return [
            'total_detentions' => (clone $baseQuery)->count(),
            'detentions_actives' => (clone $baseQuery)->where('statut', 'active')->count(),
            'detentions_resolues' => (clone $baseQuery)->where('statut', 'resolue')->count(),
            'detentions_contestees' => (clone $baseQuery)->where('statut', 'contestee')->count(),
            'cout_total_actif' => (clone $baseQuery)->where('statut', 'active')->sum('cout_total'),
            'cout_total_resolu' => (clone $baseQuery)->where('statut', 'resolue')->sum('cout_total'),
            'duree_moyenne' => (clone $baseQuery)->avg('jours_detention'),
        ];
    }

    /**
     * Résoudre une détention
     */
    public function resolveDetention(Detention $detention, ?string $observations = null): Detention
    {
        return DB::transaction(function () use ($detention, $observations) {
            $detention->update([
                'statut' => 'resolue',
                'date_fin_detention' => now(),
                'observations' => $observations
            ]);
            return $detention->load('sortieConteneur.armateur');
        });
    }

    /**
     * Calculer et créer une détention après retour (délègue au calculator)
     */
    public function calculerDetentionApresRetour(SortieConteneur $sortie): ?Detention
    {
        return $this->calculator->creerDetentionSiNecessaire($sortie);
    }

    /**
     * Obtenir les détails de calcul pour une sortie
     */
    public function getDetailsCalcul(SortieConteneur $sortie): array
    {
        return $this->calculator->getDetailsCalcul($sortie);
    }
}