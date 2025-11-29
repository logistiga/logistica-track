<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepotageResource;
use App\Models\Depotage;
use App\Http\Requests\StoreDepotageRequest;
use App\Http\Requests\UpdateDepotageRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DepotageController extends Controller
{
    /**
     * Afficher la liste des dépotages
     */
    public function index(Request $request): JsonResponse
    {
        $query = Depotage::query();

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        // Filtrage par statut
        if ($request->has('statut') && !empty($request->statut)) {
            $query->where('statut', $request->statut);
        }

        // Tri par défaut
        $query->orderBy('created_at', 'desc');

        // Pagination
        $perPage = $request->get('per_page', 15);
        $depotages = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotages récupérés avec succès',
            'data' => DepotageResource::collection($depotages->items()),
            'pagination' => [
                'total' => $depotages->total(),
                'per_page' => $depotages->perPage(),
                'current_page' => $depotages->currentPage(),
                'last_page' => $depotages->lastPage(),
                'from' => $depotages->firstItem(),
                'to' => $depotages->lastItem(),
            ]
        ]);
    }

    /**
     * Statistiques des dépotages
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_en_cours' => Depotage::enCours()->count(),
            'termines_aujourdhui' => Depotage::termine()
                ->whereDate('updated_at', today())
                ->count(),
            'operations_mois' => Depotage::termine()
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->count(),
            'montant_mensuel' => Depotage::termine()
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->sum('prix_depotage'),
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Statistiques récupérées avec succès',
            'data' => $stats
        ]);
    }

    /**
     * Créer un nouveau dépotage
     */
    public function store(StoreDepotageRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();

        $depotage = Depotage::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotage créé avec succès',
            'data' => new DepotageResource($depotage)
        ], 201);
    }

    /**
     * Afficher un dépotage spécifique
     */
    public function show(Depotage $depotage): JsonResponse
    {
        $depotage->load(['createdBy', 'updatedBy']);

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotage récupéré avec succès',
            'data' => new DepotageResource($depotage)
        ]);
    }

    /**
     * Mettre à jour un dépotage
     */
    public function update(UpdateDepotageRequest $request, Depotage $depotage): JsonResponse
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();

        $depotage->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotage mis à jour avec succès',
            'data' => new DepotageResource($depotage->fresh())
        ]);
    }

    /**
     * Supprimer un dépotage
     */
    public function destroy(Depotage $depotage): JsonResponse
    {
        $depotage->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotage supprimé avec succès'
        ]);
    }

    /**
     * Terminer un dépotage
     */
    public function terminer(Depotage $depotage): JsonResponse
    {
        $depotage->update([
            'statut' => 'termine',
            'updated_by' => Auth::id()
        ]);

        // Mettre à jour la sortie conteneur originale si liée
        if ($depotage->sortie_conteneur_id) {
            $sortieConteneur = \App\Models\SortieConteneur::find($depotage->sortie_conteneur_id);
            if ($sortieConteneur) {
                $sortieConteneur->update([
                    'statut' => 'retourne_port',
                    'date_retour' => now(),
                ]);
            }
        }

        // Créer une archive automatiquement
        \App\Models\Archive::create([
            'type_archive' => 'base_operation',
            'reference_originale' => 'depotage_' . $depotage->id,
            'donnees_originales' => [
                'type_operation' => 'depotage',
                'numero_conteneur' => $depotage->numero_conteneur,
                'nom_client' => $depotage->nom_client ?? 'N/A',
                'provenance' => $depotage->lieu_depotage ?? 'Base',
                'date_arrivee_base' => $depotage->date_depotage,
                'date_sortie_base' => now()->format('Y-m-d'),
                'camion_arrivee' => $depotage->numero_camion ?? 'N/A',
                'remorque_arrivee' => '',
                'camion_sortie' => '',
                'remorque_sortie' => '',
                'jours_gratuits' => 0,
                'jours_payants' => 0,
                'montant_total_facture' => $depotage->prix_depotage ?? 0,
            ],
            'date_archivage' => now(),
            'motif_archivage' => 'Sortie de conteneur - Dépotage',
            'archive_par' => Auth::id(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotage terminé avec succès',
            'data' => new DepotageResource($depotage->fresh())
        ]);
    }

    /**
     * Lister les dépotages en cours
     */
    public function enCours(): JsonResponse
    {
        $depotages = Depotage::enCours()
            ->orderBy('date_depotage', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Dépotages en cours récupérés avec succès',
            'data' => DepotageResource::collection($depotages)
        ]);
    }
}