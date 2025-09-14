<?php

namespace App\Services;

use App\Models\Detention;
use App\Models\SortieConteneur;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DetentionService
{
    /**
     * Récupérer toutes les détentions avec filtres
     */
    public function getAllDetentions(array $filters = [])
    {
        try {
            $query = Detention::with(['sortieConteneur.armateur']);
            
            // Filtres
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

            // Pagination
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
            \Log::error('❌ Database error in DetentionService:', ['error' => $e->getMessage()]);
            
            // Retourner des données de test si erreur
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
            
            $joursDetention = $dateDebut->diffInDays($dateFin);
            
            return Detention::create([
                'sortie_conteneur_id' => $data['sortie_conteneur_id'],
                'date_debut_detention' => $data['date_debut_detention'],
                'date_fin_detention' => $data['date_fin_detention'] ?? null,
                'jours_detention' => $joursDetention,
                'cout_par_jour' => $data['cout_par_jour'],
                'cout_total' => $joursDetention * $data['cout_par_jour'],
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
            // Recalculer les jours et le coût si nécessaire
            if (isset($data['date_fin_detention']) || isset($data['cout_par_jour'])) {
                $dateDebut = $detention->date_debut_detention;
                $dateFin = isset($data['date_fin_detention']) 
                    ? Carbon::parse($data['date_fin_detention'])
                    : ($detention->date_fin_detention ?? now());
                
                $joursDetention = $dateDebut->diffInDays($dateFin);
                $coutParJour = $data['cout_par_jour'] ?? $detention->cout_par_jour;
                
                $data['jours_detention'] = $joursDetention;
                $data['cout_total'] = $joursDetention * $coutParJour;
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
     * Calculer et créer automatiquement une détention après retour si dépassement
     */
    public function calculerDetentionApresRetour(SortieConteneur $sortie): void
    {
        if (!$sortie->date_sortie || !$sortie->date_retour) {
            return;
        }

        $joursReels = $sortie->date_sortie->diffInDays($sortie->date_retour);
        $joursAutorises = $this->determinerJoursAutorises($sortie);

        if ($joursReels <= $joursAutorises) {
            return; // Pas de dépassement
        }

        // Vérifier qu'une détention n'existe pas déjà
        if (Detention::where('sortie_conteneur_id', $sortie->id)->exists()) {
            return;
        }

        $joursDepassement = $joursReels - $joursAutorises;
        $coutParJour = $this->getCoutDetentionParJour($sortie);

        try {
            Detention::create([
                'sortie_conteneur_id' => $sortie->id,
                'date_debut_detention' => $sortie->date_sortie->copy()->addDays($joursAutorises),
                'date_fin_detention' => $sortie->date_retour,
                'jours_detention' => $joursDepassement,
                'cout_par_jour' => $coutParJour,
                'cout_total' => $joursDepassement * $coutParJour,
                'responsabilite' => 'client',
                'motif_detention' => "Dépassement de franchise de {$joursDepassement} jour(s)",
                'statut' => 'active',
                'observations' => "Détention créée automatiquement lors du retour du conteneur {$sortie->numero_conteneur}",
            ]);
        } catch (\Exception $e) {
            \Log::error('❌ Error creating automatic detention:', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Déterminer les jours autorisés selon le type de destination
     */
    private function determinerJoursAutorises(SortieConteneur $sortie): int
    {
        if ($sortie->jours_bad && $sortie->jours_bad > 0) {
            return $sortie->jours_bad;
        }

        switch ($sortie->type_destination) {
            case 'detention':
                return 0;
            case 'bad':
                return 2;
            case 'depot':
                return 7;
            default:
                return 5;
        }
    }

    /**
     * Obtenir le coût de détention par jour selon l'armateur
     */
    private function getCoutDetentionParJour(SortieConteneur $sortie): float
    {
        if ($sortie->armateur && $sortie->armateur->prix_par_jour) {
            return (float) $sortie->armateur->prix_par_jour;
        }

        return 15000; // Tarif par défaut
    }
}
}