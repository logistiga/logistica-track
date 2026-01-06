<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehiculeRequest;
use App\Http\Requests\UpdateVehiculeRequest;
use App\Http\Resources\VehiculeResource;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
     * Retourne directement le tableau sans double wrapping
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $vehicules = $this->vehiculeService->getVehiculesList($request->all());

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules récupérés avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules', 500);
        }
    }

    /**
     * Créer un nouveau véhicule
     */
    public function store(StoreVehiculeRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $vehicule = $this->vehiculeService->createVehicule($request->validated());

            DB::commit();

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule créé avec succès',
                201
            );

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la création du véhicule', 500);
        }
    }

    /**
     * Mettre à jour un véhicule
     */
    public function update(UpdateVehiculeRequest $request, Vehicule $vehicule): JsonResponse
    {
        try {
            DB::beginTransaction();

            $updatedVehicule = $this->vehiculeService->updateVehicule($vehicule, $request->validated());

            DB::commit();

            return $this->successResponse(
                new VehiculeResource($updatedVehicule),
                'Véhicule mis à jour avec succès'
            );

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la mise à jour du véhicule', 500);
        }
    }

    /**
     * Supprimer un véhicule
     */
    public function destroy(Vehicule $vehicule): JsonResponse
    {
        try {
            DB::beginTransaction();

            $this->vehiculeService->deleteVehicule($vehicule);

            DB::commit();

            return $this->successResponse(null, 'Véhicule supprimé avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression du véhicule', 500);
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

    /**
     * Récupérer les véhicules actifs (pour les routes publiques)
     */
    public function actifs(): JsonResponse
    {
        try {
            $vehicules = Vehicule::where('actif', true)
                ->orderBy('numero_parc')
                ->get();

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules actifs récupérés avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules actifs', 500);
        }
    }
}