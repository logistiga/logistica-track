<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehiculeRequest;
use App\Http\Requests\UpdateVehiculeRequest;
use App\Http\Resources\VehiculeResource;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    protected $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Lister tous les véhicules
     */
    public function index(Request $request)
    {
        $vehicules = $this->vehiculeService->getAllVehicules($request->all());

        return VehiculeResource::collection($vehicules)->additional([
            'status' => 'success',
            'message' => 'Véhicules récupérés avec succès'
        ]);
    }

    /**
     * Créer un nouveau véhicule
     */
    public function store(StoreVehiculeRequest $request)
    {
        $vehicule = $this->vehiculeService->createVehicule($request->validated());

        return new VehiculeResource($vehicule);
    }

    /**
     * Afficher un véhicule spécifique
     */
    public function show(Vehicule $vehicule)
    {
        return new VehiculeResource($vehicule);
    }

    /**
     * Mettre à jour un véhicule
     */
    public function update(UpdateVehiculeRequest $request, Vehicule $vehicule)
    {
        $vehicule = $this->vehiculeService->updateVehicule($vehicule, $request->validated());

        return new VehiculeResource($vehicule);
    }

    /**
     * Supprimer un véhicule
     */
    public function destroy(Vehicule $vehicule)
    {
        $this->vehiculeService->deleteVehicule($vehicule);

        return response()->json([
            'status' => 'success',
            'message' => 'Véhicule supprimé avec succès'
        ]);
    }

    /**
     * Lister tous les camions
     */
    public function camions(Request $request)
    {
        $camions = $this->vehiculeService->getCamions($request->all());

        return VehiculeResource::collection($camions)->additional([
            'status' => 'success',
            'message' => 'Camions récupérés avec succès'
        ]);
    }

    /**
     * Lister toutes les remorques
     */
    public function remorques(Request $request)
    {
        $remorques = $this->vehiculeService->getRemorques($request->all());

        return VehiculeResource::collection($remorques)->additional([
            'status' => 'success',
            'message' => 'Remorques récupérées avec succès'
        ]);
    }

    /**
     * Lister tous les véhicules disponibles
     */
    public function disponibles()
    {
        $vehicules = $this->vehiculeService->getVehiculesDisponibles();

        return VehiculeResource::collection($vehicules)->additional([
            'status' => 'success',
            'message' => 'Véhicules disponibles récupérés avec succès'
        ]);
    }
}