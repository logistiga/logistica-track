<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DoubleRelevage;
use App\Models\Archive;
use App\Http\Resources\DoubleRelevageResource;
use App\Http\Requests\StoreDoubleRelevageRequest;
use App\Http\Requests\UpdateDoubleRelevageRequest;
use App\Services\DoubleRelevageService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoubleRelevageController extends Controller
{
    use ApiResponseTrait;
    
    protected DoubleRelevageService $doubleRelevageService;

    public function __construct(DoubleRelevageService $doubleRelevageService)
    {
        $this->doubleRelevageService = $doubleRelevageService;
    }

    /**
     * Afficher la liste des opérations de double relevage
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['statut', 'search', 'date_debut', 'date_fin']);
        $perPage = $request->get('per_page', 15);
        
        $operations = $this->doubleRelevageService->getDoubleRelevages($filters, $perPage);

        return $this->successResponse(
            DoubleRelevageResource::collection($operations->items()),
            'Opérations de double relevage récupérées avec succès',
            200,
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
        $operation = $this->doubleRelevageService->createDoubleRelevage(
            $request->validated(), 
            auth()->id()
        );

        $operation->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new DoubleRelevageResource($operation),
            'Opération de double relevage enregistrée avec succès',
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
        $operation = $this->doubleRelevageService->updateDoubleRelevage(
            $doubleRelevage,
            $request->validated(),
            auth()->id()
        );

        return $this->successResponse(
            new DoubleRelevageResource($operation),
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
        $operation = $this->doubleRelevageService->confirmerDoubleRelevage(
            $doubleRelevage,
            auth()->id()
        );

        // Mettre à jour la sortie conteneur originale si liée
        if ($doubleRelevage->sortie_conteneur_id) {
            $sortieConteneur = \App\Models\SortieConteneur::find($doubleRelevage->sortie_conteneur_id);
            if ($sortieConteneur) {
                $sortieConteneur->update([
                    'statut' => 'retourne_port',
                    'date_retour' => $operation->date_confirmation ?? now(),
                ]);
            }
        }

        return $this->successResponse(
            new DoubleRelevageResource($operation),
            'Opération confirmée avec succès'
        );
    }

    /**
     * Récupérer les statistiques des opérations
     */
    public function stats(): JsonResponse
    {
        $stats = $this->doubleRelevageService->getStats();

        return $this->successResponse($stats, 'Statistiques récupérées avec succès');
    }

    /**
     * Récupérer les opérations en attente uniquement
     */
    public function enAttente(): JsonResponse
    {
        $operations = $this->doubleRelevageService->getDoubleRelevagesEnAttente();

        return $this->successResponse(
            DoubleRelevageResource::collection($operations),
            'Opérations en attente récupérées avec succès'
        );
    }

    /**
     * Archiver une opération de double relevage (après paiement)
     */
    public function archiver(Request $request, DoubleRelevage $doubleRelevage): JsonResponse
    {
        $request->validate([
            'numero_facture' => 'required|string',
            'date_facturation' => 'required|date',
            'montant_total' => 'required|numeric|min:0',
        ]);

        // Créer l'archive
        Archive::create([
            'type_archive' => 'base_operation',
            'reference_originale' => 'DR-' . $doubleRelevage->id,
            'donnees_originales' => [
                'type_operation' => 'double-relevage',
                'numero_conteneur' => $doubleRelevage->numero_conteneur,
                'nom_client' => $doubleRelevage->nom_client,
                'provenance' => $doubleRelevage->provenance,
                'date_arrivee_base' => $doubleRelevage->date_arrivee->format('Y-m-d'),
                'date_sortie_base' => $doubleRelevage->date_sortie ? $doubleRelevage->date_sortie->format('Y-m-d') : null,
                'camion_arrivee' => $doubleRelevage->camion_arrivee,
                'remorque_arrivee' => $doubleRelevage->remorque_arrivee,
                'camion_sortie' => $doubleRelevage->camion_sortie,
                'remorque_sortie' => $doubleRelevage->remorque_sortie,
                'jours_gratuits' => 0,
                'jours_payants' => 0,
                'montant_total_facture' => $request->montant_total,
                'date_facturation' => $request->date_facturation,
                'numero_facture' => $request->numero_facture,
                'original_data' => $doubleRelevage->toArray(),
            ],
            'date_archivage' => now(),
            'motif_archivage' => 'Double relevage payé et archivé',
            'archive_par' => auth()->id(),
            'commentaires' => $request->commentaires,
        ]);

        // Supprimer l'opération après archivage
        $doubleRelevage->delete();

        return $this->successResponse(
            null,
            'Double relevage archivé avec succès'
        );
    }
}