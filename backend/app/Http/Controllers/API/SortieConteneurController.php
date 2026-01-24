<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieConteneurRequest;
use App\Http\Requests\UpdateSortieConteneurRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieConteneurService;
use App\Services\SortieCacheService;
use App\Services\SortieArchiveService;
use App\Services\FacturationSyncService;
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
    protected SortieArchiveService $archiveService;
    protected FacturationSyncService $facturationSync;

    public function __construct(
        SortieConteneurService $sortieService,
        SortieCacheService $cacheService,
        SortieArchiveService $archiveService,
        FacturationSyncService $facturationSync
    ) {
        $this->sortieService = $sortieService;
        $this->cacheService = $cacheService;
        $this->archiveService = $archiveService;
        $this->facturationSync = $facturationSync;
    }

    /**
     * Lister toutes les sorties avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Utiliser le cache pour améliorer les performances
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

        } catch (\Throwable $e) {
            \Log::error('Error in index:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->errorResponse('Erreur lors de la récupération des sorties', 500, [
                'debug' => $e->getMessage(),
            ]);
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

            // Envoyer automatiquement vers l'app de facturation
            try {
                $this->facturationSync->envoyerNouvelleSortie($sortie);
            } catch (\Exception $e) {
                \Log::warning('Échec sync facturation lors création sortie', [
                    'sortie_id' => $sortie->id,
                    'error' => $e->getMessage()
                ]);
                // Ne pas bloquer la création si la sync échoue
            }

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
            \Log::info('🎯 CONTROLLER: Update request received', [
                'sortie_id' => $sortie->id,
                'validated_data' => $request->validated(),
                'before_update' => [
                    'numero_ordre' => $sortie->numero_ordre,
                    'pv_sortie' => $sortie->pv_sortie,
                    'pv_rentree_port' => $sortie->pv_rentree_port,
                ]
            ]);

            DB::beginTransaction();

            $oldData = $sortie->toArray();
            $updatedSortie = $this->sortieService->updateSortie($sortie, $request->validated());

            // Vérifier immédiatement après update
            $freshData = SortieConteneur::find($sortie->id);
            \Log::info('🔍 CONTROLLER: After update verification', [
                'sortie_id' => $sortie->id,
                'fresh_from_db' => [
                    'numero_ordre' => $freshData->numero_ordre,
                    'pv_sortie' => $freshData->pv_sortie,
                    'pv_rentree_port' => $freshData->pv_rentree_port,
                ]
            ]);

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
            \Log::error('❌ CONTROLLER: Error updating sortie', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            DB::rollback();
            return $this->errorResponse('Erreur lors de la mise à jour de la sortie', 500);
        }
    }

    /**
     * Archiver une sortie (créer prime_archive et changer statut)
     */
    public function archiver(SortieConteneur $sortie): JsonResponse
    {
        try {
            DB::beginTransaction();

            $this->archiveService->archiverSortie($sortie);
            $this->cacheService->invalidateAllCaches();

            logActivity('sortie_archived', $sortie, 'Sortie archivée depuis Ordre');

            DB::commit();

            return $this->successResponse(
                new SortieConteneurResource($sortie->load(['armateur', 'camion', 'remorque'])),
                'Sortie archivée avec succès'
            );

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse($e->getMessage(), 400);
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

    /**
     * Lister les archives de sorties (primes payées)
     */
    public function archives(Request $request): JsonResponse
    {
        try {
            $archives = $this->archiveService->getAllArchives();
            return $this->successResponse($archives, 'Archives récupérées avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur archives sorties: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la récupération des archives', 500);
        }
    }

    /**
     * Rechercher dans les archives de sorties
     */
    public function archivesSearch(Request $request): JsonResponse
    {
        try {
            $archives = $this->archiveService->searchArchives($request->all());
            return $this->successResponse($archives, 'Recherche effectuée avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur recherche archives: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Statistiques des archives de sorties
     */
    public function archivesStats(Request $request): JsonResponse
    {
        try {
            $stats = $this->archiveService->getArchivesStats($request->all());
            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            \Log::error('Erreur stats archives: ' . $e->getMessage());
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Récupérer les sorties en cours
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
     * Récupérer les sorties retournées
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
     * Rechercher des sorties
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            $sorties = $this->sortieService->searchSorties($query, $request->all());
            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Recherche effectuée'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Statistiques des sorties
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->sortieService->getStatistics($request->all());
            return $this->successResponse($stats, 'Statistiques récupérées');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Exporter les sorties
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $sorties = $this->sortieService->getAllSorties($request->all());
            return $this->successResponse($sorties, 'Export effectué');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }

    /**
     * Récupérer les infos de détention d'une sortie
     */
    public function detention(SortieConteneur $sortie): JsonResponse
    {
        try {
            $info = $this->sortieService->getDetentionInfo($sortie);
            return $this->successResponse($info, 'Infos détention récupérées');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des infos détention', 500);
        }
    }

    /**
     * Récupérer les infos de facturation d'une sortie
     */
    public function facture(SortieConteneur $sortie): JsonResponse
    {
        try {
            $info = $this->sortieService->getFacturationInfo($sortie);
            return $this->successResponse($info, 'Infos facturation récupérées');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des infos facturation', 500);
        }
    }

    /**
     * Récupérer la timeline d'une sortie
     */
    public function timeline(SortieConteneur $sortie): JsonResponse
    {
        try {
            $timeline = $this->sortieService->getTimeline($sortie);
            return $this->successResponse($timeline, 'Timeline récupérée');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la timeline', 500);
        }
    }
}
