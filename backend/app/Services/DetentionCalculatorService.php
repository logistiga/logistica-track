<?php

namespace App\Services;

use App\Models\Detention;
use App\Models\SortieConteneur;
use Carbon\Carbon;

class DetentionCalculatorService
{
    /**
     * Configuration des jours de franchise par type de destination
     */
    private const FRANCHISE_DAYS = [
        'detention' => 0,
        'bad' => 2,
        'depot' => 7,
        'client' => 5,
    ];

    private const DEFAULT_COST_PER_DAY = 15000;

    /**
     * Calculer les jours autorisés pour une sortie
     */
    public function getJoursAutorises(SortieConteneur $sortie): int
    {
        // Priorité aux jours BAD définis manuellement
        if ($sortie->jours_bad && $sortie->jours_bad > 0) {
            return $sortie->jours_bad;
        }

        return self::FRANCHISE_DAYS[$sortie->type_destination] ?? self::FRANCHISE_DAYS['client'];
    }

    /**
     * Obtenir le coût de détention par jour
     */
    public function getCoutParJour(SortieConteneur $sortie): float
    {
        if ($sortie->armateur && $sortie->armateur->prix_par_jour) {
            return (float) $sortie->armateur->prix_par_jour;
        }

        return config('detention.tarifs_par_jour.default', self::DEFAULT_COST_PER_DAY);
    }

    /**
     * Calculer les jours réels hors port
     */
    public function getJoursReels(SortieConteneur $sortie): int
    {
        if (!$sortie->date_sortie) {
            return 0;
        }

        $dateFin = $sortie->date_retour ?? now();
        return (int) $sortie->date_sortie->diffInDays($dateFin);
    }

    /**
     * Calculer le dépassement de franchise
     */
    public function getJoursDepassement(SortieConteneur $sortie): int
    {
        $joursReels = $this->getJoursReels($sortie);
        $joursAutorises = $this->getJoursAutorises($sortie);

        return max(0, $joursReels - $joursAutorises);
    }

    /**
     * Vérifier si une sortie a un dépassement
     */
    public function hasDepassement(SortieConteneur $sortie): bool
    {
        return $this->getJoursDepassement($sortie) > 0;
    }

    /**
     * Calculer le coût total de détention
     */
    public function calculerCoutTotal(SortieConteneur $sortie): float
    {
        $joursDepassement = $this->getJoursDepassement($sortie);
        $coutParJour = $this->getCoutParJour($sortie);

        return $joursDepassement * $coutParJour;
    }

    /**
     * Calculer le coût pour un nombre de jours spécifique
     */
    public function calculerCoutPourJours(int $jours, float $coutParJour): float
    {
        return $jours * $coutParJour;
    }

    /**
     * Obtenir les détails complets de calcul de détention
     */
    public function getDetailsCalcul(SortieConteneur $sortie): array
    {
        $joursReels = $this->getJoursReels($sortie);
        $joursAutorises = $this->getJoursAutorises($sortie);
        $joursDepassement = $this->getJoursDepassement($sortie);
        $coutParJour = $this->getCoutParJour($sortie);

        return [
            'jours_reels' => $joursReels,
            'jours_autorises' => $joursAutorises,
            'jours_depassement' => $joursDepassement,
            'cout_par_jour' => $coutParJour,
            'cout_total' => $joursDepassement * $coutParJour,
            'has_depassement' => $joursDepassement > 0,
            'date_fin_franchise' => $sortie->date_sortie 
                ? $sortie->date_sortie->copy()->addDays($joursAutorises)->format('Y-m-d')
                : null,
        ];
    }

    /**
     * Créer une détention automatiquement après retour si dépassement
     */
    public function creerDetentionSiNecessaire(SortieConteneur $sortie): ?Detention
    {
        if (!$sortie->date_sortie || !$sortie->date_retour) {
            return null;
        }

        if (!$this->hasDepassement($sortie)) {
            return null;
        }

        // Vérifier qu'une détention n'existe pas déjà
        if (Detention::where('sortie_conteneur_id', $sortie->id)->exists()) {
            return null;
        }

        $details = $this->getDetailsCalcul($sortie);

        try {
            return Detention::create([
                'sortie_conteneur_id' => $sortie->id,
                'date_debut_detention' => $sortie->date_sortie->copy()->addDays($details['jours_autorises']),
                'date_fin_detention' => $sortie->date_retour,
                'jours_detention' => $details['jours_depassement'],
                'cout_par_jour' => $details['cout_par_jour'],
                'cout_total' => $details['cout_total'],
                'responsabilite' => null,
                'motif_detention' => "Dépassement de franchise de {$details['jours_depassement']} jour(s)",
                'statut' => 'active',
                'observations' => "Détention créée automatiquement lors du retour du conteneur {$sortie->numero_conteneur}",
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur création détention automatique:', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Recalculer les jours et coûts d'une détention existante
     */
    public function recalculerDetention(Detention $detention, array $data = []): array
    {
        $joursClient = $data['jours_client'] ?? $detention->jours_client ?? 0;
        $joursLogistiga = $data['jours_logistiga'] ?? $detention->jours_logistiga ?? 0;
        $coutParJour = $data['cout_par_jour'] ?? $detention->cout_par_jour;

        $totalJours = $joursClient + $joursLogistiga;

        return [
            'jours_detention' => $totalJours,
            'jours_client' => $joursClient,
            'jours_logistiga' => $joursLogistiga,
            'cout_par_jour' => $coutParJour,
            'cout_total' => $totalJours * $coutParJour,
        ];
    }
}
