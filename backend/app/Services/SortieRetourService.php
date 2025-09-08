<?php

namespace App\Services;

use App\Models\SortieConteneur;
use App\Http\Requests\RetourSortieRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
}