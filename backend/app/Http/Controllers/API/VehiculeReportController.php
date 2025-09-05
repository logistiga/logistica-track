<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VehiculeReportController extends Controller
{
    use ApiResponseTrait;

    protected VehiculeService $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Historique d'un véhicule
     */
    public function history(Vehicule $vehicule): JsonResponse
    {
        try {
            $history = $this->vehiculeService->getVehiculeHistory($vehicule);

            return $this->successResponse($history, 'Historique du véhicule récupéré');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'historique', 500);
        }
    }

    /**
     * Planning de maintenance d'un véhicule
     */
    public function maintenanceSchedule(Vehicule $vehicule): JsonResponse
    {
        try {
            $schedule = $this->vehiculeService->getMaintenanceSchedule($vehicule);

            return $this->successResponse($schedule, 'Planning de maintenance récupéré');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du planning', 500);
        }
    }

    /**
     * Export des véhicules
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'format' => 'required|in:excel,csv,pdf',
                'filters' => 'sometimes|array',
            ]);

            $exportData = $this->vehiculeService->exportVehicules(
                $request->format,
                $request->filters ?? []
            );

            // Logger l'activité
            try {
                logActivity('vehicules_export', null, "Export des véhicules en format {$request->format}");
            } catch (\Exception $e) {
                // Silently fail
            }

            return $this->successResponse($exportData, 'Export généré avec succès');

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres d\'export invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }
}