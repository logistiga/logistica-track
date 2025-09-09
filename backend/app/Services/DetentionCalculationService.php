<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Models\Detention;
use Illuminate\Support\Facades\Log;

class DetentionCalculationService
{
    /**
     * Calculer et créer automatiquement une détention après retour si dépassement
     */
    public function calculerDetentionApresRetour(SortieConteneur $sortie, ?string $responsabilite = null): void
    {
        Log::info('🔍 Calculating detention for sortie:', [
            'sortie_id' => $sortie->id,
            'numero_conteneur' => $sortie->numero_conteneur,
            'date_sortie' => $sortie->date_sortie,
            'date_retour' => $sortie->date_retour,
            'jours_bad' => $sortie->jours_bad,
            'type_destination' => $sortie->type_destination
        ]);

        // Vérifier que les données nécessaires sont disponibles
        if (!$sortie->date_sortie || !$sortie->date_retour) {
            Log::warning('❌ Missing required dates for detention calculation');
            return;
        }

        // Calculer les jours réels hors port
        $joursReels = $sortie->date_sortie->diffInDays($sortie->date_retour);
        
        // Déterminer les jours autorisés selon le type de destination
        $joursAutorises = $this->determinerJoursAutorises($sortie);

        Log::info('📊 Detention calculation details:', [
            'jours_reels' => $joursReels,
            'jours_autorises' => $joursAutorises,
            'depassement' => $joursReels - $joursAutorises
        ]);

        // Vérifier s'il y a dépassement
        if ($joursReels <= $joursAutorises) {
            Log::info('✅ No detention needed - within authorized period');
            return; // Pas de dépassement, pas de détention
        }

        // Calculer les jours de dépassement
        $joursDepassement = $joursReels - $joursAutorises;

        // Vérifier qu'une détention n'existe pas déjà
        $detentionExistante = Detention::where('sortie_conteneur_id', $sortie->id)->first();
        if ($detentionExistante) {
            Log::info('ℹ️ Detention already exists for this sortie:', ['detention_id' => $detentionExistante->id]);
            return;
        }

        // Créer la détention
        $this->creerDetention($sortie, $joursAutorises, $joursDepassement, $responsabilite);
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

    /**
     * Créer une détention
     */
    private function creerDetention(SortieConteneur $sortie, int $joursAutorises, int $joursDepassement, ?string $responsabilite): void
    {
        // Tarif par défaut en FCFA
        $coutParJour = $this->getCoutDetentionParJour($sortie);

        // Calculer le coût total
        $coutTotal = $joursDepassement * $coutParJour;

        try {
            $detention = Detention::create([
                'sortie_conteneur_id' => $sortie->id,
                'date_debut_detention' => $sortie->date_sortie->copy()->addDays($joursAutorises),
                'date_fin_detention' => $sortie->date_retour,
                'jours_detention' => $joursDepassement,
                'cout_par_jour' => $coutParJour,
                'cout_total' => $coutTotal,
                'responsabilite' => $responsabilite ?? 'client',
                'motif_detention' => "Dépassement de franchise de {$joursDepassement} jour(s)",
                'statut' => 'active',
                'observations' => "Détention créée automatiquement lors du retour du conteneur {$sortie->numero_conteneur}",
            ]);

            Log::info('✅ Detention created automatically:', [
                'detention_id' => $detention->id,
                'sortie_id' => $sortie->id,
                'jours_depassement' => $joursDepassement,
                'cout_total' => $detention->cout_total
            ]);
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas faire échouer la confirmation de retour
            Log::error('❌ Error creating automatic detention:', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}