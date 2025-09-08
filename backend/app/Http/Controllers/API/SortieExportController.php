<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ExportService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SortieExportController extends Controller
{
    use ApiResponseTrait;

    protected ExportService $exportService;

    public function __construct(ExportService $exportService)
    {
        $this->exportService = $exportService;
    }

    /**
     * Export des données
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'format' => 'required|in:excel,csv,pdf',
                'filters' => 'sometimes|array',
            ]);

            $exportData = $this->exportService->exportSorties(
                $request->format,
                $request->filters ?? []
            );

            // Logger l'activité
            logActivity('sorties_export', null, "Export des sorties en format {$request->format}");

            return $this->successResponse($exportData, 'Export généré avec succès');

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres d\'export invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }
}