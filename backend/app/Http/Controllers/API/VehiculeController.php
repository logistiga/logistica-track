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
            try {
                logActivity('vehicule_created', $vehicule, 'Création d\'un nouveau véhicule');
            } catch (\Exception $e) {
                // Silently fail
            }

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
            try {
                logActivity('vehicule_updated', $updatedVehicule, 'Mise à jour d\'un véhicule');
            } catch (\Exception $e) {
                // Silently fail
            }

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
            try {
                logActivity('vehicule_deleted', null, "Suppression du véhicule {$vehicule->numero_parc}");
            } catch (\Exception $e) {
                // Silently fail
            }

            DB::commit();

            return $this->successResponse(null, 'Véhicule supprimé avec succès');

        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la suppression du véhicule', 500);
        }
    }

}