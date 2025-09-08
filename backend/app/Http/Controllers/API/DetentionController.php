<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DetentionResource;
use App\Models\Detention;
use App\Services\DetentionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DetentionController extends Controller
{
    protected DetentionService $detentionService;

    public function __construct(DetentionService $detentionService)
    {
        $this->detentionService = $detentionService;
    }

    /**
     * Lister toutes les détentions avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        \Log::info('📥 DetentionController@index called with params:', $request->all());
        \Log::info('🌐 Request URL:', $request->url());
        \Log::info('🔑 User authenticated:', auth()->check() ? auth()->user()->id : 'anonymous');
        
        try {
            \Log::info('🔍 Starting detention service call');
            $result = $this->detentionService->getAllDetentions($request->all());
            \Log::info('📊 DetentionService result:', [
                'count' => count($result['data'] ?? []), 
                'meta' => $result['meta'] ?? null,
                'sample_data' => array_slice($result['data'] ?? [], 0, 2)
            ]);

            $response = $this->successResponse(
                DetentionResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                    'links' => $result['links'] ?? null,
                ]),
                'Détentions récupérées avec succès'
            );
            
            \Log::info('📤 Sending response with data count:', count($result['data'] ?? []));
            return $response;
            
        } catch (\Exception $e) {
            \Log::error('❌ Exception in DetentionController@index:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Erreur lors de la récupération des détentions: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Créer une nouvelle détention
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sortie_conteneur_id' => 'required|exists:sortie_conteneurs,id',
            'date_debut_detention' => 'required|date',
            'cout_par_jour' => 'required|numeric|min:0',
            'responsabilite' => ['required', Rule::in(['client', 'transitaire', 'transporteur', 'autre'])],
            'motif_detention' => 'required|string|max:1000',
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $detention = $this->detentionService->createDetention($validated);
            return $this->successResponse(
                new DetentionResource($detention),
                'Détention créée avec succès',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Afficher une détention spécifique
     */
    public function show(Detention $detention): JsonResponse
    {
        try {
            $detention->load('sortieConteneur.armateur');
            return $this->successResponse(
                new DetentionResource($detention),
                'Détention récupérée avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Mettre à jour une détention
     */
    public function update(Request $request, Detention $detention): JsonResponse
    {
        $validated = $request->validate([
            'date_fin_detention' => 'nullable|date|after:date_debut_detention',
            'cout_par_jour' => 'sometimes|numeric|min:0',
            'responsabilite' => ['sometimes', Rule::in(['client', 'transitaire', 'transporteur', 'autre'])],
            'motif_detention' => 'sometimes|string|max:1000',
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $updatedDetention = $this->detentionService->updateDetention($detention, $validated);
            return $this->successResponse(
                new DetentionResource($updatedDetention),
                'Détention mise à jour avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Supprimer une détention
     */
    public function destroy(Detention $detention): JsonResponse
    {
        try {
            $this->detentionService->deleteDetention($detention);
            return $this->successResponse(null, 'Détention supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupérer les détentions actives
     */
    public function actives(Request $request): JsonResponse
    {
        try {
            $result = $this->detentionService->getActivesDetentions($request->all());
            return $this->successResponse(
                DetentionResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                ]),
                'Détentions actives récupérées avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détentions actives: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupérer les détentions résolues
     */
    public function resolues(Request $request): JsonResponse
    {
        try {
            $result = $this->detentionService->getResoluesDetentions($request->all());
            return $this->successResponse(
                DetentionResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                ]),
                'Détentions résolues récupérées avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détentions résolues: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupérer les statistiques des détentions
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->detentionService->getDetentionStats($request->all());
            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du calcul des statistiques: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Exporter les détentions
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $exportData = $this->detentionService->exportDetentions($request->all());
            return $this->successResponse($exportData, 'Export généré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Résoudre une détention
     */
    public function resolve(Request $request, Detention $detention): JsonResponse
    {
        $validated = $request->validate([
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $resolvedDetention = $this->detentionService->resolveDetention($detention, $validated['observations'] ?? null);
            return $this->successResponse(
                new DetentionResource($resolvedDetention),
                'Détention résolue avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la résolution de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Contester une détention
     */
    public function contest(Request $request, Detention $detention): JsonResponse
    {
        $validated = $request->validate([
            'motif' => 'required|string|max:1000',
        ]);

        try {
            $contestedDetention = $this->detentionService->contestDetention($detention, $validated['motif']);
            return $this->successResponse(
                new DetentionResource($contestedDetention),
                'Détention contestée avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la contestation de la détention: ' . $e->getMessage(), 500);
        }
    }
}