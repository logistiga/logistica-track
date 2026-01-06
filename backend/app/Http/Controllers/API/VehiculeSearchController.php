<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehiculeResource;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VehiculeSearchController extends Controller
{
    use ApiResponseTrait;

    protected VehiculeService $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Recherche de véhicules
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string|min:2',
                'type' => 'sometimes|in:camion,remorque',
            ]);

            $results = $this->vehiculeService->searchVehicules(
                $request->query,
                $request->only(['type', 'statut'])
            );

            return $this->successResponse(
                VehiculeResource::collection($results),
                'Résultats de recherche récupérés'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres de recherche invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Lister les camions
     */
    public function camions(Request $request): JsonResponse
    {
        try {
            $camions = $this->vehiculeService->getCamions($request->all());

            return $this->successResponse(
                VehiculeResource::collection($camions),
                'Camions récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des camions', 500);
        }
    }

    /**
     * Lister les remorques
     */
    public function remorques(Request $request): JsonResponse
    {
        try {
            $remorques = $this->vehiculeService->getRemorques($request->all());

            return $this->successResponse(
                VehiculeResource::collection($remorques),
                'Remorques récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des remorques', 500);
        }
    }
}