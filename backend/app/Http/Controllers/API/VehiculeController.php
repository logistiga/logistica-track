<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehiculeResource;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    use ApiResponseTrait;

    protected VehiculeService $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Lister tous les véhicules avec filtres
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $result = $this->vehiculeService->getAllVehicules($request->all());

            return $this->successResponse(
                VehiculeResource::collection($result['data']),
                'Véhicules récupérés avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules', 500);
        }
    }

    /**
     * Afficher un véhicule spécifique
     */
    public function show(Vehicule $vehicule): JsonResponse
    {
        try {
            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule récupéré avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du véhicule', 500);
        }
    }
}