<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieConteneurRequest;
use App\Http\Requests\UpdateSortieConteneurRequest;
use App\Http\Requests\RetourSortieRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieConteneurService;
use App\Services\ExportService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SortieConteneurController extends Controller
{
    use ApiResponseTrait;

    protected SortieConteneurService $sortieService;
    protected ExportService $exportService;

    public function __construct(
        SortieConteneurService $sortieService,
        ExportService $exportService
    ) {
        $this->sortieService = $sortieService;
        $this->exportService = $exportService;
    }

    /**
     * Lister toutes les sorties avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Temporairement désactiver le cache basé sur l'utilisateur
            $cacheKey = 'sorties_' . md5(serialize($request->all()));
            
            $result = Cache::remember($cacheKey, CACHE_SHORT, function () use ($request) {
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

            // Invalider le cache des sorties
            Cache::tags(['sorties'])->flush();

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

            // Invalider le cache
            Cache::tags(['sorties'])->flush();

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

            // Invalider le cache
            Cache::tags(['sorties'])->flush();

            // Logger l'activité
            logActivity('sortie_deleted', null, "Suppression de la sortie {$sortie->numero_conteneur}");

            DB::commit();

            return $this->successResponse(null, 'Sortie supprimée avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression de la sortie', 500);
        }
    }

    /**
     * Confirmer le retour d'une sortie
     */
    public function return(RetourSortieRequest $request, SortieConteneur $sortie): JsonResponse
    {
        try {
            if ($sortie->statut === 'retourne_port') {
                return $this->errorResponse('Cette sortie est déjà retournée', 400);
            }

            DB::beginTransaction();

            $returnedSortie = $this->sortieService->confirmerRetour($sortie, $request->validated());

            // Invalider le cache
            Cache::tags(['sorties'])->flush();

            // Logger l'activité
            try {
                logActivity('sortie_returned', $returnedSortie, 'Retour de conteneur confirmé');
            } catch (\Exception $e) {
                // Silently fail to avoid breaking the application
            }

            // Envoyer une notification
            try {
                if (\Illuminate\Support\Facades\Auth::check()) {
                    sendNotification(
                        \Illuminate\Support\Facades\Auth::id(),
                        'sortie_returned',
                        'Retour de conteneur',
                        "Le conteneur {$sortie->numero_conteneur} est retourné au port",
                        ['sortie_id' => $sortie->id]
                    );
                }
            } catch (\Exception $e) {
                // Silently fail to avoid breaking the application
            }

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
            return $this->errorResponse('Erreur lors de la confirmation du retour', 500);
        }
    }

    /**
     * Obtenir les statistiques des sorties
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'sorties_stats_' . md5(serialize($request->all()));
            
            $stats = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($request) {
                return $this->sortieService->getStatistics($request->all());
            });

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Sorties en cours
     */
    public function enCours(Request $request): JsonResponse
    {
        try {
            $sorties = $this->sortieService->getSortiesEnCours($request->all());

            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Sorties en cours récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties en cours', 500);
        }
    }

    /**
     * Sorties retournées
     */
    public function retournees(Request $request): JsonResponse
    {
        try {
            $sorties = $this->sortieService->getSortiesRetournees($request->all());

            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Sorties retournées récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties retournées', 500);
        }
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

            $results = $this->sortieService->searchSorties(
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

            $results = $this->sortieService->bulkReturn($request->sorties);

            // Invalider le cache
            Cache::tags(['sorties'])->flush();

            // Logger l'activité
            logActivity('bulk_return', null, 'Retour en lot de ' . count($request->sorties) . ' conteneurs');

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

    /**
     * Timeline d'une sortie
     */
    public function timeline(SortieConteneur $sortie): JsonResponse
    {
        try {
            $timeline = $this->sortieService->getTimeline($sortie);

            return $this->successResponse($timeline, 'Timeline récupérée avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la timeline', 500);
        }
    }

    /**
     * Informations de détention d'une sortie
     */
    public function detention(SortieConteneur $sortie): JsonResponse
    {
        try {
            $detention = $this->sortieService->getDetentionInfo($sortie);

            return $this->successResponse($detention, 'Informations de détention récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations de détention', 500);
        }
    }

    /**
     * Informations de facturation d'une sortie
     */
    public function facture(SortieConteneur $sortie): JsonResponse
    {
        try {
            $facturation = $this->sortieService->getFacturationInfo($sortie);

            return $this->successResponse($facturation, 'Informations de facturation récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations de facturation', 500);
        }
    }
}