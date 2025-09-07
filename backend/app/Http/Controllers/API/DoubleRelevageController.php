<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DoubleRelevage;
use App\Http\Resources\DoubleRelevageResource;
use App\Http\Requests\StoreDoubleRelevageRequest;
use App\Http\Requests\UpdateDoubleRelevageRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoubleRelevageController extends Controller
{
    use ApiResponseTrait;

    /**
     * Afficher la liste des opérations de double relevage
     */
    public function index(Request $request): JsonResponse
    {
        $query = DoubleRelevage::with(['createdBy', 'updatedBy']);

        // Filtres
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero_conteneur', 'like', "%{$search}%")
                  ->orWhere('nom_client', 'like', "%{$search}%")
                  ->orWhere('provenance', 'like', "%{$search}%");
            });
        }

        $operations = $query->orderBy('date_creation', 'desc')
                           ->paginate($request->get('per_page', 15));

        return $this->successResponse(
            DoubleRelevageResource::collection($operations->items()),
            'Opérations de double relevage récupérées avec succès',
            [
                'pagination' => [
                    'total' => $operations->total(),
                    'per_page' => $operations->perPage(),
                    'current_page' => $operations->currentPage(),
                    'last_page' => $operations->lastPage(),
                ]
            ]
        );
    }

    /**
     * Enregistrer une nouvelle opération de double relevage
     */
    public function store(StoreDoubleRelevageRequest $request): JsonResponse
    {
        $operation = DoubleRelevage::create(array_merge(
            $request->validated(),
            [
                'created_by' => auth()->id(),
                'date_creation' => now()->toDateString()
            ]
        ));

        $operation->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new DoubleRelevageResource($operation),
            'Opération de double relevage enregistrée avec succès',
            [],
            201
        );
    }

    /**
     * Afficher une opération spécifique
     */
    public function show(DoubleRelevage $doubleRelevage): JsonResponse
    {
        $doubleRelevage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new DoubleRelevageResource($doubleRelevage),
            'Opération récupérée avec succès'
        );
    }

    /**
     * Mettre à jour une opération
     */
    public function update(UpdateDoubleRelevageRequest $request, DoubleRelevage $doubleRelevage): JsonResponse
    {
        $doubleRelevage->update(array_merge(
            $request->validated(),
            ['updated_by' => auth()->id()]
        ));

        $doubleRelevage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new DoubleRelevageResource($doubleRelevage),
            'Opération mise à jour avec succès'
        );
    }

    /**
     * Supprimer une opération
     */
    public function destroy(DoubleRelevage $doubleRelevage): JsonResponse
    {
        $doubleRelevage->delete();

        return $this->successResponse(
            null,
            'Opération supprimée avec succès'
        );
    }

    /**
     * Confirmer une opération de double relevage
     */
    public function confirmer(DoubleRelevage $doubleRelevage): JsonResponse
    {
        $doubleRelevage->update([
            'statut' => 'confirme',
            'date_confirmation' => now()->toDateString(),
            'updated_by' => auth()->id()
        ]);

        $doubleRelevage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new DoubleRelevageResource($doubleRelevage),
            'Opération confirmée avec succès'
        );
    }

    /**
     * Récupérer les statistiques des opérations
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_en_attente' => DoubleRelevage::where('statut', 'en_attente')->count(),
            'total_confirmees' => DoubleRelevage::where('statut', 'confirme')->count(),
            'operations_aujourdhui' => DoubleRelevage::whereDate('date_creation', today())->count(),
            'montant_mensuel' => DoubleRelevage::where('statut', 'confirme')
                                             ->whereMonth('date_confirmation', now()->month)
                                             ->whereYear('date_confirmation', now()->year)
                                             ->sum('montant_operation'),
        ];

        return $this->successResponse($stats, 'Statistiques récupérées avec succès');
    }

    /**
     * Récupérer les opérations en attente uniquement
     */
    public function enAttente(): JsonResponse
    {
        $operations = DoubleRelevage::enAttente()
                                  ->with(['createdBy', 'updatedBy'])
                                  ->orderBy('date_creation', 'desc')
                                  ->get();

        return $this->successResponse(
            DoubleRelevageResource::collection($operations),
            'Opérations en attente récupérées avec succès'
        );
    }
}