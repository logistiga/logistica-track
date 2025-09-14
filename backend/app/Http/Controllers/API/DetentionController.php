<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\DetentionResource;
use App\Models\Detention;
use App\Models\SortieConteneur;
use App\Services\DetentionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DetentionController extends Controller
{
    protected DetentionService $detentionService;

    public function __construct(DetentionService $detentionService)
    {
        $this->detentionService = $detentionService;
    }

    /**
     * Lister toutes les détentions avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $result = $this->detentionService->getAllDetentions($request->all());
            return $this->successResponse(
                DetentionResource::collection($result['data'])->additional([
                    'meta' => $result['meta'],
                ]),
                'Détentions récupérées avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détentions: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Créer une nouvelle détention
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sortie_conteneur_id' => 'required|exists:sortie_conteneurs,id',
            'date_debut_detention' => 'required|date',
            'cout_par_jour' => 'required|numeric|min:0',
            'responsabilite' => ['required', Rule::in(['client', 'logistiga', 'partagee'])],
            'motif_detention' => 'required|string|max:1000',
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $detention = $this->detentionService->createDetention($validated);
            return $this->successResponse(
                new DetentionResource($detention),
                'Détention créée avec succès',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Mettre à jour une détention
     */
    public function update(Request $request, Detention $detention): JsonResponse
    {
        $validated = $request->validate([
            'date_fin_detention' => 'nullable|date|after:date_debut_detention',
            'cout_par_jour' => 'sometimes|numeric|min:0',
            'responsabilite' => ['sometimes', Rule::in(['client', 'logistiga', 'partagee'])],
            'motif_detention' => 'sometimes|string|max:1000',
            'observations' => 'nullable|string|max:1000',
            'jours_client' => 'sometimes|numeric|min:0',
            'jours_logistiga' => 'sometimes|numeric|min:0',
        ]);

        try {
            $updatedDetention = $this->detentionService->updateDetention($detention, $validated);
            return $this->successResponse(
                new DetentionResource($updatedDetention),
                'Détention mise à jour avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Récupérer les statistiques des détentions
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->detentionService->getDetentionStats($request->all());
            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du calcul des statistiques: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Résoudre une détention
     */
    public function resolve(Request $request, Detention $detention): JsonResponse
    {
        $validated = $request->validate([
            'observations' => 'nullable|string|max:1000',
        ]);

        try {
            $resolvedDetention = $this->detentionService->resolveDetention($detention, $validated['observations'] ?? null);
            return $this->successResponse(
                new DetentionResource($resolvedDetention),
                'Détention résolue avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la résolution de la détention: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Créer les détentions manquantes pour les conteneurs retournés
     */
    public function createMissingDetentions(): JsonResponse
    {
        try {
            Log::info('🔍 API: Recherche des conteneurs retournés sans détention...');

            $sorties = SortieConteneur::with(['armateur', 'detention'])
                ->where('statut', 'retourne_port')
                ->whereDoesntHave('detention')
                ->whereNotNull('date_retour')
                ->get();

            $created = [];
            foreach ($sorties as $sortie) {
                $joursGratuits = $sortie->armateur->jours_gratuits ?? 0;
                $dateSortie = Carbon::parse($sortie->date_sortie);
                $dateRetour = Carbon::parse($sortie->date_retour);
                $joursRealises = $dateSortie->diffInDays($dateRetour);
                $joursDepassement = $joursRealises - $joursGratuits;
                
                if ($joursDepassement > 0) {
                    $detention = new Detention();
                    $detention->sortie_conteneur_id = $sortie->id;
                    $detention->date_debut_detention = $dateSortie->copy()->addDays($joursGratuits);
                    $detention->jours_detention = $joursDepassement;
                    $detention->cout_par_jour = $sortie->armateur->prix_par_jour ?? 15000;
                    $detention->cout_total = $joursDepassement * $detention->cout_par_jour;
                    $detention->motif_detention = 'Dépassement automatique calculé après retour';
                    $detention->statut = 'active';
                    $detention->save();

                    $created[] = [
                        'numero_conteneur' => $sortie->numero_conteneur,
                        'jours_depassement' => $joursDepassement,
                        'cout_total' => $detention->cout_total
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => count($created) . ' détention(s) créée(s) avec succès',
                'data' => ['created_count' => count($created), 'created' => $created]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création des détentions: ' . $e->getMessage(),
            ], 500);
        }
    }
}
}