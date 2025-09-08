<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieConteneurRequest;
use App\Http\Requests\UpdateSortieConteneurRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieConteneurService;
use App\Services\SortieCacheService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SortieConteneurController extends Controller
{
    use ApiResponseTrait;

    protected SortieConteneurService $sortieService;
    protected SortieCacheService $cacheService;

    public function __construct(
        SortieConteneurService $sortieService,
        SortieCacheService $cacheService
    ) {
        $this->sortieService = $sortieService;
        $this->cacheService = $cacheService;
    }

    /**
     * Lister toutes les sorties avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $cacheKey = $this->cacheService->generateCacheKey('sorties', $request->all());
            
            $result = $this->cacheService->remember($cacheKey, CACHE_SHORT, function () use ($request) {
                return $this->sortieService->getAllSorties($request->all());
            });

            return $this->successResponse(
                SortieConteneurResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                    'links' => $result['links'] ?? null,
                ]),
                'Sorties récupérées avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties', 500);
        }
    }

    /**
     * Créer une nouvelle sortie
     */
    public function store(StoreSortieConteneurRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $sortie = $this->sortieService->createSortie($request->validated());

            $this->cacheService->invalidateAllCaches();

            // Logger l'activité
            try {
                logActivity('sortie_created', $sortie, 'Création d\'une nouvelle sortie');
            } catch (\Exception $e) {
                // Silently fail to avoid breaking the application
            }

            // Envoyer une notification
            try {
                if (\Illuminate\Support\Facades\Auth::check()) {
                    sendNotification(
                        \Illuminate\Support\Facades\Auth::id(),
                        'sortie_created',
                        'Nouvelle sortie créée',
                        "Sortie {$sortie->numero_conteneur} créée avec succès",
                        ['sortie_id' => $sortie->id]
                    );
                }
            } catch (\Exception $e) {
                // Silently fail to avoid breaking the application
            }

            DB::commit();

            return $this->successResponse(
                new SortieConteneurResource($sortie->load(['armateur', 'camion', 'remorque'])),
                'Sortie créée avec succès',
                201
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Erreur controller création sortie:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return $this->errorResponse('Erreur lors de la création de la sortie: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Afficher une sortie spécifique
     */
    public function show(SortieConteneur $sortie): JsonResponse
    {
        try {
            $sortie->load([
                'armateur',
                'camion',
                'remorque',
                'camionRetour',
                'remorqueRetour',
                'createdBy',
                'updatedBy',
                'detention',
                'facturation'
            ]);

            return $this->successResponse(
                new SortieConteneurResource($sortie),
                'Sortie récupérée avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la sortie', 500);
        }
    }

    /**
     * Mettre à jour une sortie
     */
    public function update(UpdateSortieConteneurRequest $request, SortieConteneur $sortie): JsonResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $sortie->toArray();
            $updatedSortie = $this->sortieService->updateSortie($sortie, $request->validated());

            $this->cacheService->invalidateAllCaches();

            // Logger l'activité
            logActivity('sortie_updated', $updatedSortie, 'Mise à jour d\'une sortie');

            DB::commit();

            return $this->successResponse(
                new SortieConteneurResource($updatedSortie->load(['armateur', 'camion', 'remorque'])),
                'Sortie mise à jour avec succès'
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la mise à jour de la sortie', 500);
        }
    }

    /**
     * Supprimer une sortie
     */
    public function destroy(SortieConteneur $sortie): JsonResponse
    {
        try {
            // Vérifier si la sortie peut être supprimée
            if ($sortie->statut === 'en_cours') {
                return $this->errorResponse('Impossible de supprimer une sortie en cours', 400);
            }

            DB::beginTransaction();

            $this->sortieService->deleteSortie($sortie);

            $this->cacheService->invalidateAllCaches();

            // Logger l'activité
            logActivity('sortie_deleted', null, "Suppression de la sortie {$sortie->numero_conteneur}");

            DB::commit();

            return $this->successResponse(null, 'Sortie supprimée avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression de la sortie', 500);
        }
    }

}