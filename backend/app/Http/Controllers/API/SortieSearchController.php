<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SortieConteneurResource;
use App\Services\SortieSearchService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SortieSearchController extends Controller
{
    use ApiResponseTrait;

    protected SortieSearchService $searchService;

    public function __construct(SortieSearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Recherche avancée
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string|min:2',
                'filters' => 'sometimes|array',
            ]);

            $results = $this->searchService->search(
                $request->query,
                $request->filters ?? []
            );

            return $this->successResponse(
                SortieConteneurResource::collection($results),
                'Résultats de recherche récupérés'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres de recherche invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }
}