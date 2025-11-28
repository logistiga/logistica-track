<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Stockage;
use App\Models\Archive;
use App\Http\Resources\StockageResource;
use App\Http\Requests\StoreStockageRequest;
use App\Http\Requests\UpdateStockageRequest;
use App\Http\Requests\SortieStockageRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StockageController extends Controller
{
    use ApiResponseTrait;

    /**
     * Afficher la liste des stockages
     */
    public function index(Request $request): JsonResponse
    {
        $query = Stockage::with(['createdBy', 'updatedBy']);

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

        $stockages = $query->orderBy('date_arrivee', 'desc')
                          ->paginate($request->get('per_page', 15));

        return $this->successResponse(
            StockageResource::collection($stockages->items()),
            'Stockages récupérés avec succès',
            [
                'pagination' => [
                    'total' => $stockages->total(),
                    'per_page' => $stockages->perPage(),
                    'current_page' => $stockages->currentPage(),
                    'last_page' => $stockages->lastPage(),
                ]
            ]
        );
    }

    /**
     * Enregistrer un nouveau stockage
     */
    public function store(StoreStockageRequest $request): JsonResponse
    {
        $stockage = Stockage::create(array_merge(
            $request->validated(),
            ['created_by' => auth()->id()]
        ));

        $stockage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new StockageResource($stockage),
            'Stockage enregistré avec succès',
            [],
            201
        );
    }

    /**
     * Afficher un stockage spécifique
     */
    public function show(Stockage $stockage): JsonResponse
    {
        $stockage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new StockageResource($stockage),
            'Stockage récupéré avec succès'
        );
    }

    /**
     * Mettre à jour un stockage
     */
    public function update(UpdateStockageRequest $request, Stockage $stockage): JsonResponse
    {
        $stockage->update(array_merge(
            $request->validated(),
            ['updated_by' => auth()->id()]
        ));

        $stockage->load(['createdBy', 'updatedBy']);

        return $this->successResponse(
            new StockageResource($stockage),
            'Stockage mis à jour avec succès'
        );
    }

    /**
     * Supprimer un stockage
     */
    public function destroy(Stockage $stockage): JsonResponse
    {
        $stockage->delete();

        return $this->successResponse(
            null,
            'Stockage supprimé avec succès'
        );
    }

    /**
     * Confirmer la sortie d'un conteneur du stockage
     */
    public function sortie(SortieStockageRequest $request, Stockage $stockage): JsonResponse
    {
        $stockage->update([
            'statut' => 'sorti',
            'date_sortie' => $request->date_sortie,
            'observations' => $request->observations,
            'updated_by' => auth()->id()
        ]);

        $stockage->load(['createdBy', 'updatedBy']);

        $joursDetention = $stockage->jours_detention;
        $montantDetention = $stockage->montant_detention;

        return $this->successResponse(
            new StockageResource($stockage),
            'Sortie confirmée avec succès',
            [
                'detention' => [
                    'jours' => $joursDetention,
                    'montant' => $montantDetention,
                    'montant_formate' => number_format($montantDetention, 0, ',', ' ') . ' FCFA'
                ]
            ]
        );
    }

    /**
     * Récupérer les statistiques des stockages
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_stockes' => Stockage::where('statut', 'stocke')->count(),
            'en_attente_sortie' => Stockage::where('statut', 'en_attente_sortie')->count(),
            'sortis_aujourdhui' => Stockage::where('statut', 'sorti')
                                         ->whereDate('date_sortie', today())
                                         ->count(),
            'montant_detention_mensuel' => Stockage::where('statut', 'sorti')
                                                 ->whereMonth('date_sortie', now()->month)
                                                 ->whereYear('date_sortie', now()->year)
                                                 ->get()
                                                 ->sum('montant_detention'),
        ];

        return $this->successResponse($stats, 'Statistiques récupérées avec succès');
    }

    /**
     * Récupérer les stockages actifs uniquement
     */
    public function actifs(): JsonResponse
    {
        $stockages = Stockage::actifs()
                           ->with(['createdBy', 'updatedBy'])
                           ->orderBy('date_arrivee', 'desc')
                           ->get();

        return $this->successResponse(
            StockageResource::collection($stockages),
            'Stockages actifs récupérés avec succès'
        );
    }

    /**
     * Archiver un stockage (après paiement)
     */
    public function archiver(Request $request, Stockage $stockage): JsonResponse
    {
        $request->validate([
            'numero_facture' => 'required|string',
            'date_facturation' => 'required|date',
            'montant_total' => 'required|numeric|min:0',
        ]);

        // Créer l'archive
        Archive::create([
            'type_archive' => 'base_operation',
            'reference_originale' => 'STOCK-' . $stockage->id,
            'donnees_originales' => [
                'type_operation' => 'stockage',
                'numero_conteneur' => $stockage->numero_conteneur,
                'nom_client' => $stockage->nom_client,
                'provenance' => $stockage->provenance,
                'date_arrivee_base' => $stockage->date_arrivee->format('Y-m-d'),
                'date_sortie_base' => $stockage->date_sortie ? $stockage->date_sortie->format('Y-m-d') : null,
                'camion_arrivee' => $stockage->camion_arrivee,
                'remorque_arrivee' => $stockage->remorque_arrivee,
                'camion_sortie' => $stockage->camion_sortie,
                'remorque_sortie' => $stockage->remorque_sortie,
                'jours_gratuits' => $stockage->jours_gratuits ?? 0,
                'jours_payants' => $stockage->jours_payants ?? 0,
                'montant_total_facture' => $request->montant_total,
                'date_facturation' => $request->date_facturation,
                'numero_facture' => $request->numero_facture,
                'original_data' => $stockage->toArray(),
            ],
            'date_archivage' => now(),
            'motif_archivage' => 'Stockage payé et archivé',
            'archive_par' => auth()->id(),
            'commentaires' => $request->commentaires,
        ]);

        // Supprimer le stockage après archivage
        $stockage->delete();

        return $this->successResponse(
            null,
            'Stockage archivé avec succès'
        );
    }
}