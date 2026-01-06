<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SortieRetourService
{
    protected SortieConteneurService $sortieService;

    public function __construct(SortieConteneurService $sortieService)
    {
        $this->sortieService = $sortieService;
    }

    /**
     * Confirmer le retour d'une sortie
     * Note: La création de détention est gérée automatiquement par SortieConteneurService::confirmerRetour
     */
    public function confirmerRetour(SortieConteneur $sortie, array $data): SortieConteneur
    {
        if ($sortie->statut === 'retourne_port') {
            throw new \Exception('Cette sortie est déjà retournée');
        }

        // La détention est créée automatiquement dans confirmerRetour si nécessaire
        $returnedSortie = $this->sortieService->confirmerRetour($sortie, $data);

        $this->logActivity($returnedSortie);
        $this->sendNotification($sortie);

        return $returnedSortie;
    }

    /**
     * Retour en lot
     */
    public function bulkReturn(array $sorties): array
    {
        $results = $this->sortieService->bulkReturn($sorties);

        try {
            logActivity('bulk_return', null, 'Retour en lot de ' . count($sorties) . ' conteneurs');
        } catch (\Exception $e) {
            // Silently fail
        }

        return $results;
    }

    /**
     * Logger l'activité de retour
     */
    private function logActivity(SortieConteneur $sortie): void
    {
        try {
            logActivity('sortie_returned', $sortie, 'Retour de conteneur confirmé');
        } catch (\Exception $e) {
            // Silently fail
        }
    }

    /**
     * Envoyer notification de retour
     */
    private function sendNotification(SortieConteneur $sortie): void
    {
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
            // Silently fail
        }
    }
}