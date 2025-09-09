<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Models\Vehicule;

class SortieStatisticsService
{
    /**
     * Obtenir les statistiques des sorties
     */
    public function getStatistics(array $filters = [])
    {
        $query = SortieConteneur::query();
        
        // Appliquer les filtres si fournis
        $this->applyFilters($query, $filters);

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

    /**
     * Calculer la moyenne des jours hors port
     */
    private function calculateAverageJoursHorsPort(array $filters = [])
    {
        $query = SortieConteneur::where('statut', 'retourne_port');
        
        $this->applyFilters($query, $filters);

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
     * Appliquer les filtres à la requête
     */
    private function applyFilters($query, array $filters)
    {
        if (!empty($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (!empty($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        if (!empty($filters['code_armateur'])) {
            $query->where('code_armateur', $filters['code_armateur']);
        }
    }
}