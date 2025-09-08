<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieStatsService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SortieStatsController extends Controller
{
    use ApiResponseTrait;

    protected SortieStatsService $statsService;

    public function __construct(SortieStatsService $statsService)
    {
        $this->statsService = $statsService;
    }

    /**
     * Obtenir les statistiques des sorties
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->statsService->getStatistics($request->all());

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Sorties en cours
     */
    public function enCours(Request $request): JsonResponse
    {
        try {
            $sorties = $this->statsService->getSortiesEnCours($request->all());

            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Sorties en cours récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties en cours', 500);
        }
    }

    /**
     * Sorties retournées
     */
    public function retournees(Request $request): JsonResponse
    {
        try {
            $sorties = $this->statsService->getSortiesRetournees($request->all());

            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Sorties retournées récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties retournées', 500);
        }
    }

    /**
     * Timeline d'une sortie
     */
    public function timeline(SortieConteneur $sortie): JsonResponse
    {
        try {
            $timeline = $this->statsService->getTimeline($sortie);

            return $this->successResponse($timeline, 'Timeline récupérée avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la timeline', 500);
        }
    }

    /**
     * Informations de détention d'une sortie
     */
    public function detention(SortieConteneur $sortie): JsonResponse
    {
        try {
            $detention = $this->statsService->getDetentionInfo($sortie);

            return $this->successResponse($detention, 'Informations de détention récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations de détention', 500);
        }
    }

    /**
     * Informations de facturation d'une sortie
     */
    public function facture(SortieConteneur $sortie): JsonResponse
    {
        try {
            $facturation = $this->statsService->getFacturationInfo($sortie);

            return $this->successResponse($facturation, 'Informations de facturation récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations de facturation', 500);
        }
    }
}