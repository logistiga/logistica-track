<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Models\Detention;
use App\Http\Requests\RetourSortieRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SortieRetourService
{
    use ApiResponseTrait;

    protected SortieConteneurService $sortieService;

    public function __construct(SortieConteneurService $sortieService)
    {
        $this->sortieService = $sortieService;
    }

    /**
     * Confirmer le retour d'une sortie
     */
    public function confirmerRetour(SortieConteneur $sortie, array $data): SortieConteneur
    {
        if ($sortie->statut === 'retourne_port') {
            throw new \Exception('Cette sortie est déjà retournée');
        }

        $returnedSortie = $this->sortieService->confirmerRetour($sortie, $data);

        // Créer automatiquement une détention si nécessaire
        $this->creerDetentionSiNecessaire($returnedSortie, $data['responsabilite'] ?? null);

        // Logger l'activité
        try {
            logActivity('sortie_returned', $returnedSortie, 'Retour de conteneur confirmé');
        } catch (\Exception $e) {
            // Silently fail to avoid breaking the application
        }

        // Envoyer une notification
        try {
            if (Auth::check()) {
                sendNotification(
                    Auth::id(),
                    'sortie_returned',
                    'Retour de conteneur',
                    "Le conteneur {$sortie->numero_conteneur} est retourné au port",
                    ['sortie_id' => $sortie->id]
                );
            }
        } catch (\Exception $e) {
            // Silently fail to avoid breaking the application
        }

        return $returnedSortie;
    }

    /**
     * Retour en lot
     */
    public function bulkReturn(array $sorties): array
    {
        $results = $this->sortieService->bulkReturn($sorties);

        // Logger l'activité
        logActivity('bulk_return', null, 'Retour en lot de ' . count($sorties) . ' conteneurs');

        return $results;
    }

    /**
     * Créer une détention automatiquement si nécessaire
     */
    private function creerDetentionSiNecessaire(SortieConteneur $sortie, ?string $responsabilite = null)
    {
        // Vérifier si une détention existe déjà
        if ($sortie->detention) {
            return;
        }

        // Calculer les jours de franchise autorisés
        $joursGratuits = $sortie->armateur->jours_gratuits ?? 0;
        
        // Calculer les jours réalisés
        $dateSortie = Carbon::parse($sortie->date_sortie);
        $dateRetour = Carbon::parse($sortie->date_retour);
        $joursRealises = $dateSortie->diffInDays($dateRetour);
        
        // Vérifier s'il y a dépassement
        $joursDepassement = $joursRealises - $joursGratuits;
        
        if ($joursDepassement > 0) {
            // Créer la détention
            $detention = new Detention();
            $detention->sortie_conteneur_id = $sortie->id;
            $detention->date_debut_detention = $dateSortie->addDays($joursGratuits);
            $detention->date_fin_detention = null;
            $detention->jours_detention = $joursDepassement;
            $detention->cout_par_jour = $sortie->armateur->prix_par_jour ?? config('detention.tarifs_par_jour.default');
            $detention->cout_total = $joursDepassement * $detention->cout_par_jour;
            $detention->responsabilite = $responsabilite; // Laisser vide, sera défini après
            $detention->motif_detention = 'Dépassement automatique calculé après retour';
            $detention->statut = 'active';
            $detention->save();

            Log::info("Détention automatique créée", [
                'sortie_id' => $sortie->id,
                'detention_id' => $detention->id,
                'jours_depassement' => $joursDepassement,
                'cout_total' => $detention->cout_total
            ]);
        }
    }
}