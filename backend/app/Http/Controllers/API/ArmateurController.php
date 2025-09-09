<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArmateurRequest;
use App\Http\Requests\UpdateArmateurRequest;
use App\Http\Resources\ArmateurResource;
use App\Models\Armateur;
use App\Services\ArmateurService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArmateurController extends Controller
{
    use ApiResponseTrait;

    protected ArmateurService $armateurService;

    public function __construct(ArmateurService $armateurService)
    {
        $this->armateurService = $armateurService;
    }

    /**
     * Lister tous les armateurs avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $result = $this->armateurService->getAllArmateurs($request->all());
            
            if (!$result || !isset($result['data'])) {
                return $this->successResponse([], 'Aucun armateur trouvé');
            }

            return $this->successResponse(
                ArmateurResource::collection($result['data'])->additional([
                    'meta' => $result['meta'] ?? ['total' => count($result['data'])],
                    'links' => $result['links'] ?? null,
                ]),
                'Armateurs récupérés avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du chargement des armateurs', 500);
        }
    }

    /**
     * Créer un nouvel armateur
     */
    public function store(StoreArmateurRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $armateurData = array_merge($request->validated(), ['actif' => true]);
            $armateur = $this->armateurService->createArmateur($armateurData);
            DB::commit();

            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur créé avec succès',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Erreur lors de la création de l\'armateur', 500);
        }
    }

    /**
     * Afficher un armateur spécifique
     */
    public function show(Armateur $armateur): JsonResponse
    {
        try {
            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur récupéré avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'armateur', 500);
        }
    }

    /**
     * Modifier un armateur
     */
    public function update(UpdateArmateurRequest $request, Armateur $armateur): JsonResponse
    {
        try {
            DB::beginTransaction();
            $updatedArmateur = $this->armateurService->updateArmateur($armateur, $request->validated());
            DB::commit();

            return $this->successResponse(
                new ArmateurResource($updatedArmateur),
                'Armateur modifié avec succès'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Erreur lors de la modification de l\'armateur', 500);
        }
    }

    /**
     * Supprimer un armateur
     */
    public function destroy(Armateur $armateur): JsonResponse
    {
        try {
            if ($armateur->sorties()->exists()) {
                return $this->errorResponse(
                    'Impossible de supprimer un armateur avec des sorties associées',
                    400
                );
            }

            $this->armateurService->deleteArmateur($armateur);
            return $this->successResponse(null, 'Armateur supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'armateur', 500);
        }
    }

    /**
     * Lister les armateurs actifs (API publique)
     */
    public function actifs(): JsonResponse
    {
        try {
            $armateurs = $this->armateurService->getArmateursPourSelection();
            return $this->successResponse($armateurs, 'Armateurs actifs récupérés');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des armateurs actifs', 500);
        }
    }

    /**
     * Statistiques de détention pour un armateur
     */
    public function detentionStats(Armateur $armateur): JsonResponse
    {
        try {
            $stats = $this->armateurService->getDetentionStats($armateur);
            return $this->successResponse($stats, 'Statistiques de détention récupérées');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Statistiques générales d'un armateur
     */
    public function stats(Armateur $armateur): JsonResponse
    {
        try {
            $stats = $this->armateurService->getArmateurStats($armateur);
            return $this->successResponse($stats, 'Statistiques récupérées');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }
}