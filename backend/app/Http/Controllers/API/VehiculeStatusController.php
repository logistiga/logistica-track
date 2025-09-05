<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehiculeResource;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class VehiculeStatusController extends Controller
{
    use ApiResponseTrait;

    protected VehiculeService $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Lister les véhicules disponibles
     */
    public function disponibles(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'vehicules_disponibles_' . ($request->type ?? 'all');
            
            $vehicules = Cache::remember($cacheKey, CACHE_SHORT, function () use ($request) {
                return $this->vehiculeService->getVehiculesDisponibles($request->type);
            });

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules disponibles récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules disponibles', 500);
        }
    }

    /**
     * Véhicules disponibles pour les API publiques
     */
    public function disponiblesPublic(): JsonResponse
    {
        try {
            $cacheKey = 'vehicules_disponibles_public';
            
            $vehicules = Cache::remember($cacheKey, CACHE_SHORT, function () {
                return Vehicule::disponibles()
                    ->select(['id', 'numero_parc', 'type', 'immatriculation'])
                    ->get();
            });

            return $this->successResponse($vehicules, 'Véhicules disponibles récupérés');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules', 500);
        }
    }

    /**
     * Véhicules en mission
     */
    public function enMission(Request $request): JsonResponse
    {
        try {
            $vehicules = $this->vehiculeService->getVehiculesEnMission($request->all());

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules en mission récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules en mission', 500);
        }
    }

    /**
     * Véhicules en maintenance
     */
    public function maintenance(Request $request): JsonResponse
    {
        try {
            $vehicules = $this->vehiculeService->getVehiculesEnMaintenance($request->all());

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules en maintenance récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules en maintenance', 500);
        }
    }

    /**
     * Assigner un véhicule à une mission
     */
    public function assign(Request $request, Vehicule $vehicule): JsonResponse
    {
        try {
            $request->validate([
                'mission_type' => 'required|string',
                'mission_details' => 'sometimes|array',
            ]);

            if ($vehicule->statut !== 'disponible') {
                return $this->errorResponse('Ce véhicule n\'est pas disponible', 400);
            }

            $vehicule->update(['statut' => 'en_mission']);

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            try {
                logActivity('vehicule_assigned', $vehicule, "Véhicule assigné à: {$request->mission_type}");
            } catch (\Exception $e) {
                // Silently fail
            }

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule assigné avec succès'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'assignation du véhicule', 500);
        }
    }

    /**
     * Libérer un véhicule d'une mission
     */
    public function release(Vehicule $vehicule): JsonResponse
    {
        try {
            if ($vehicule->statut !== 'en_mission') {
                return $this->errorResponse('Ce véhicule n\'est pas en mission', 400);
            }

            $vehicule->update(['statut' => 'disponible']);

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            try {
                logActivity('vehicule_released', $vehicule, 'Véhicule libéré de sa mission');
            } catch (\Exception $e) {
                // Silently fail
            }

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule libéré avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la libération du véhicule', 500);
        }
    }
}