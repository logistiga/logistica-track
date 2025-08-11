<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehiculeRequest;
use App\Http\Requests\UpdateVehiculeRequest;
use App\Http\Resources\VehiculeResource;
use App\Models\Vehicule;
use App\Services\VehiculeService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class VehiculeController extends Controller
{
    use ApiResponseTrait;

    protected VehiculeService $vehiculeService;

    public function __construct(VehiculeService $vehiculeService)
    {
        $this->vehiculeService = $vehiculeService;
    }

    /**
     * Lister tous les véhicules avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'vehicules_' . md5(serialize($request->all()));
            
            $result = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($request) {
                return $this->vehiculeService->getAllVehicules($request->all());
            });

            return $this->successResponse(
                VehiculeResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                    'links' => $result['links'] ?? null,
                ]),
                'Véhicules récupérés avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules', 500);
        }
    }

    /**
     * Créer un nouveau véhicule
     */
    public function store(StoreVehiculeRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $vehicule = $this->vehiculeService->createVehicule($request->validated());

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            logActivity('vehicule_created', $vehicule, 'Création d\'un nouveau véhicule');

            DB::commit();

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule créé avec succès',
                201
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la création du véhicule', 500);
        }
    }

    /**
     * Afficher un véhicule spécifique
     */
    public function show(Vehicule $vehicule): JsonResponse
    {
        try {
            $vehicule->load([
                'sortiesCommeAttele' => function ($query) {
                    $query->latest()->limit(5);
                },
                'sortiesCommeRemorque' => function ($query) {
                    $query->latest()->limit(5);
                }
            ]);

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule récupéré avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du véhicule', 500);
        }
    }

    /**
     * Mettre à jour un véhicule
     */
    public function update(UpdateVehiculeRequest $request, Vehicule $vehicule): JsonResponse
    {
        try {
            DB::beginTransaction();

            $updatedVehicule = $this->vehiculeService->updateVehicule($vehicule, $request->validated());

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            logActivity('vehicule_updated', $updatedVehicule, 'Mise à jour d\'un véhicule');

            DB::commit();

            return $this->successResponse(
                new VehiculeResource($updatedVehicule),
                'Véhicule mis à jour avec succès'
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la mise à jour du véhicule', 500);
        }
    }

    /**
     * Supprimer un véhicule
     */
    public function destroy(Vehicule $vehicule): JsonResponse
    {
        try {
            // Vérifier si le véhicule est en mission
            if ($vehicule->statut === 'en_mission') {
                return $this->errorResponse(
                    'Impossible de supprimer un véhicule en mission',
                    400
                );
            }

            // Vérifier s'il y a des sorties en cours
            if ($vehicule->sortiesCommeAttele()->whereIn('statut', ['en_cours', 'livre_client'])->exists() ||
                $vehicule->sortiesCommeRemorque()->whereIn('statut', ['en_cours', 'livre_client'])->exists()) {
                return $this->errorResponse(
                    'Impossible de supprimer un véhicule avec des sorties en cours',
                    400
                );
            }

            DB::beginTransaction();

            $this->vehiculeService->deleteVehicule($vehicule);

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            logActivity('vehicule_deleted', null, "Suppression du véhicule {$vehicule->numero_parc}");

            DB::commit();

            return $this->successResponse(null, 'Véhicule supprimé avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression du véhicule', 500);
        }
    }

    /**
     * Lister les véhicules disponibles
     */
    public function disponibles(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'vehicules_disponibles_' . ($request->type ?? 'all');
            
            $vehicules = Cache::remember($cacheKey, CACHE_SHORT, function () use ($request) {
                return $this->vehiculeService->getVehiculesDisponibles($request->type);
            });

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules disponibles récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules disponibles', 500);
        }
    }

    /**
     * Véhicules disponibles pour les API publiques
     */
    public function disponiblesPublic(): JsonResponse
    {
        try {
            $cacheKey = 'vehicules_disponibles_public';
            
            $vehicules = Cache::remember($cacheKey, CACHE_SHORT, function () {
                return Vehicule::disponibles()
                    ->select(['id', 'numero_parc', 'type', 'immatriculation'])
                    ->get();
            });

            return $this->successResponse($vehicules, 'Véhicules disponibles récupérés');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules', 500);
        }
    }

    /**
     * Lister les camions
     */
    public function camions(Request $request): JsonResponse
    {
        try {
            $camions = $this->vehiculeService->getCamions($request->all());

            return $this->successResponse(
                VehiculeResource::collection($camions),
                'Camions récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des camions', 500);
        }
    }

    /**
     * Lister les remorques
     */
    public function remorques(Request $request): JsonResponse
    {
        try {
            $remorques = $this->vehiculeService->getRemorques($request->all());

            return $this->successResponse(
                VehiculeResource::collection($remorques),
                'Remorques récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des remorques', 500);
        }
    }

    /**
     * Véhicules en mission
     */
    public function enMission(Request $request): JsonResponse
    {
        try {
            $vehicules = $this->vehiculeService->getVehiculesEnMission($request->all());

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules en mission récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules en mission', 500);
        }
    }

    /**
     * Véhicules en maintenance
     */
    public function maintenance(Request $request): JsonResponse
    {
        try {
            $vehicules = $this->vehiculeService->getVehiculesEnMaintenance($request->all());

            return $this->successResponse(
                VehiculeResource::collection($vehicules),
                'Véhicules en maintenance récupérés'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des véhicules en maintenance', 500);
        }
    }

    /**
     * Recherche de véhicules
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string|min:2',
                'type' => 'sometimes|in:camion,remorque',
                'statut' => 'sometimes|in:disponible,en_mission,maintenance',
            ]);

            $results = $this->vehiculeService->searchVehicules(
                $request->query,
                $request->only(['type', 'statut'])
            );

            return $this->successResponse(
                VehiculeResource::collection($results),
                'Résultats de recherche récupérés'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres de recherche invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la recherche', 500);
        }
    }

    /**
     * Assigner un véhicule à une mission
     */
    public function assign(Request $request, Vehicule $vehicule): JsonResponse
    {
        try {
            $request->validate([
                'mission_type' => 'required|string',
                'mission_details' => 'sometimes|array',
            ]);

            if ($vehicule->statut !== 'disponible') {
                return $this->errorResponse('Ce véhicule n\'est pas disponible', 400);
            }

            $vehicule->update(['statut' => 'en_mission']);

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            logActivity('vehicule_assigned', $vehicule, "Véhicule assigné à: {$request->mission_type}");

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule assigné avec succès'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'assignation du véhicule', 500);
        }
    }

    /**
     * Libérer un véhicule d'une mission
     */
    public function release(Vehicule $vehicule): JsonResponse
    {
        try {
            if ($vehicule->statut !== 'en_mission') {
                return $this->errorResponse('Ce véhicule n\'est pas en mission', 400);
            }

            $vehicule->update(['statut' => 'disponible']);

            // Invalider le cache
            Cache::tags(['vehicules'])->flush();

            // Logger l'activité
            logActivity('vehicule_released', $vehicule, 'Véhicule libéré de sa mission');

            return $this->successResponse(
                new VehiculeResource($vehicule),
                'Véhicule libéré avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la libération du véhicule', 500);
        }
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
            logActivity('vehicules_export', null, "Export des véhicules en format {$request->format}");

            return $this->successResponse($exportData, 'Export généré avec succès');

        } catch (ValidationException $e) {
            return $this->errorResponse('Paramètres d\'export invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'export', 500);
        }
    }
}