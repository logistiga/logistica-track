<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RetourSortieRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieRetourService;
use App\Services\SortieCacheService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SortieRetourController extends Controller
{
    use ApiResponseTrait;

    protected SortieRetourService $retourService;
    protected SortieCacheService $cacheService;

    public function __construct(
        SortieRetourService $retourService,
        SortieCacheService $cacheService
    ) {
        $this->retourService = $retourService;
        $this->cacheService = $cacheService;
    }

    /**
     * Confirmer le retour d'une sortie
     */
    public function return(RetourSortieRequest $request, SortieConteneur $sortie): JsonResponse
    {
        try {
            DB::beginTransaction();

            $returnedSortie = $this->retourService->confirmerRetour($sortie, $request->validated());

            $this->cacheService->invalidateAllCaches();

            DB::commit();

            return $this->successResponse(
                new SortieConteneurResource($returnedSortie->load(['armateur', 'camionRetour', 'remorqueRetour'])),
                'Retour confirmé avec succès'
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Erreur lors de la confirmation du retour:', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Erreur lors de la confirmation du retour: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Retour en lot
     */
    public function bulkReturn(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'sorties' => 'required|array|min:1',
                'sorties.*.id' => 'required|exists:sortie_conteneurs,id',
                'sorties.*.camion_retour_id' => 'required|exists:vehicules,id',
                'sorties.*.remorque_retour_id' => 'required|exists:vehicules,id',
                'sorties.*.observations' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $results = $this->retourService->bulkReturn($request->sorties);

            $this->cacheService->invalidateAllCaches();

            DB::commit();

            return $this->successResponse($results, 'Retours en lot traités avec succès');

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors du retour en lot', 500);
        }
    }
}