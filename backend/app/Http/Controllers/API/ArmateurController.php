<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArmateurRequest;
use App\Http\Requests\UpdateArmateurRequest;
use App\Http\Resources\ArmateurResource;
use App\Http\Resources\SortieConteneurResource;
use App\Models\Armateur;
use App\Services\ArmateurService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ArmateurController extends Controller
{
    use ApiResponseTrait;

    protected ArmateurService $armateurService;

    public function __construct(ArmateurService $armateurService)
    {
        $this->armateurService = $armateurService;
    }

    /**
     * Lister tous les armateurs avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'armateurs_' . md5(serialize($request->all()));
            
            $result = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($request) {
                return $this->armateurService->getAllArmateurs($request->all());
            });

            return $this->successResponse(
                ArmateurResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                    'links' => $result['links'] ?? null,
                ]),
                'Armateurs récupérés avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des armateurs', 500);
        }
    }

    /**
     * Créer un nouvel armateur
     */
    public function store(StoreArmateurRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $armateur = $this->armateurService->createArmateur($request->validated());

            // Invalider le cache
            Cache::tags(['armateurs'])->flush();

            // Logger l'activité
            logActivity('armateur_created', $armateur, 'Création d\'un nouvel armateur');

            DB::commit();

            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur créé avec succès',
                201
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la création de l\'armateur', 500);
        }
    }

    /**
     * Afficher un armateur spécifique
     */
    public function show(Armateur $armateur): JsonResponse
    {
        try {
            $armateur->load(['sorties' => function ($query) {
                $query->latest()->limit(10);
            }]);

            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur récupéré avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'armateur', 500);
        }
    }

    /**
     * Mettre à jour un armateur
     */
    public function update(UpdateArmateurRequest $request, Armateur $armateur): JsonResponse
    {
        try {
            DB::beginTransaction();

            $updatedArmateur = $this->armateurService->updateArmateur($armateur, $request->validated());

            // Invalider le cache
            Cache::tags(['armateurs'])->flush();

            // Logger l'activité
            logActivity('armateur_updated', $updatedArmateur, 'Mise à jour d\'un armateur');

            DB::commit();

            return $this->successResponse(
                new ArmateurResource($updatedArmateur),
                'Armateur mis à jour avec succès'
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la mise à jour de l\'armateur', 500);
        }
    }

    /**
     * Supprimer un armateur
     */
    public function destroy(Armateur $armateur): JsonResponse
    {
        try {
            // Vérifier si l'armateur a des sorties en cours
            if ($armateur->sorties()->whereIn('statut', ['en_cours', 'livre_client'])->exists()) {
                return $this->errorResponse(
                    'Impossible de supprimer un armateur avec des sorties en cours',
                    400
                );
            }

            DB::beginTransaction();

            $this->armateurService->deleteArmateur($armateur);

            // Invalider le cache
            Cache::tags(['armateurs'])->flush();

            // Logger l'activité
            logActivity('armateur_deleted', null, "Suppression de l'armateur {$armateur->code}");

            DB::commit();

            return $this->successResponse(null, 'Armateur supprimé avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression de l\'armateur', 500);
        }
    }

    /**
     * Lister les armateurs actifs
     */
    public function actifs(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'armateurs_actifs';
            
            $armateurs = Cache::remember($cacheKey, CACHE_LONG, function () {
                return $this->armateurService->getArmateurActifs();
            });

            return $this->successResponse(
                ArmateurResource::collection($armateurs),
                'Armateurs actifs récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des armateurs actifs', 500);
        }
    }

    /**
     * Armateurs actifs pour les API publiques
     */
    public function actifsPublic(): JsonResponse
    {
        try {
            $cacheKey = 'armateurs_actifs_public';
            
            $armateurs = Cache::remember($cacheKey, CACHE_LONG, function () {
                return Armateur::actifs()
                    ->select(['id', 'code', 'nom', 'type_conteneur'])
                    ->get();
            });

            return $this->successResponse($armateurs, 'Armateurs actifs récupérés');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des armateurs', 500);
        }
    }

    /**
     * Recherche d'armateurs
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string|min:2',
                'type' => 'sometimes|string',
            ]);

            $results = $this->armateurService->searchArmateurs(
                $request->query,
                $request->type
            );

            return $this->successResponse(
                ArmateurResource::collection($results),
                'Résultats de recherche récupérés'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres de recherche invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Activer un armateur
     */
    public function activate(Armateur $armateur): JsonResponse
    {
        try {
            $armateur->update(['actif' => true]);

            // Invalider le cache
            Cache::tags(['armateurs'])->flush();

            // Logger l'activité
            logActivity('armateur_activated', $armateur, 'Activation d\'un armateur');

            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur activé avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'activation de l\'armateur', 500);
        }
    }

    /**
     * Désactiver un armateur
     */
    public function deactivate(Armateur $armateur): JsonResponse
    {
        try {
            // Vérifier s'il y a des sorties en cours
            if ($armateur->sorties()->whereIn('statut', ['en_cours', 'livre_client'])->exists()) {
                return $this->errorResponse(
                    'Impossible de désactiver un armateur avec des sorties en cours',
                    400
                );
            }

            $armateur->update(['actif' => false]);

            // Invalider le cache
            Cache::tags(['armateurs'])->flush();

            // Logger l'activité
            logActivity('armateur_deactivated', $armateur, 'Désactivation d\'un armateur');

            return $this->successResponse(
                new ArmateurResource($armateur),
                'Armateur désactivé avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la désactivation de l\'armateur', 500);
        }
    }

    /**
     * Obtenir les sorties d'un armateur
     */
    public function sorties(Request $request, Armateur $armateur): JsonResponse
    {
        try {
            $sorties = $this->armateurService->getSortiesArmateur($armateur, $request->all());

            return $this->successResponse(
                SortieConteneurResource::collection($sorties),
                'Sorties de l\'armateur récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sorties', 500);
        }
    }

    /**
     * Statistiques d'un armateur
     */
    public function stats(Armateur $armateur): JsonResponse
    {
        try {
            $cacheKey = "armateur_stats_{$armateur->id}";
            
            $stats = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($armateur) {
                return $this->armateurService->getArmateurStats($armateur);
            });

            return $this->successResponse($stats, 'Statistiques de l\'armateur récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Export des armateurs
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'format' => 'required|in:excel,csv,pdf',
                'filters' => 'sometimes|array',
            ]);

            $exportData = $this->armateurService->exportArmateurs(
                $request->format,
                $request->filters ?? []
            );

            // Logger l'activité
            logActivity('armateurs_export', null, "Export des armateurs en format {$request->format}");

            return $this->successResponse($exportData, 'Export généré avec succès');

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres d\'export invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }
}