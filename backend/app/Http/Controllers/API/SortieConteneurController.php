<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieConteneurRequest;
use App\Http\Requests\UpdateSortieConteneurRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieConteneurService;
use App\Services\SortieCacheService;
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

    public function __construct(
        SortieConteneurService $sortieService,
        SortieCacheService $cacheService
    ) {
        $this->sortieService = $sortieService;
        $this->cacheService = $cacheService;
    }

    /**
     * Lister toutes les sorties avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
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

            $this->cacheService->invalidateAllCaches();

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
            $archives = DB::table('prime_archives as pa')
                ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
                ->join('armateurs as a', 'sc.code_armateur', '=', 'a.code')
                ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_id')
                ->select(
                    'pa.id',
                    'sc.numero_conteneur as numeroConteneur',
                    'a.code as codeArmateur',
                    'pa.nom_client as nomClient',
                    'sc.date_sortie as dateSortiePort',
                    'sc.date_retour as dateRetourPort',
                    'sc.destination as destinationInitiale',
                    DB::raw('COALESCE(d.jours_bat, 0) as joursBAT'),
                    DB::raw('COALESCE(d.jours_realises, 0) as joursRealises'),
                    DB::raw('COALESCE(d.jours_depassement, 0) as joursDepassement'),
                    'd.responsabilite',
                    DB::raw('COALESCE(d.jours_client, 0) as joursClient'),
                    DB::raw('COALESCE(d.jours_logistiga, 0) as joursLogistiga'),
                    DB::raw('COALESCE(d.montant_total, 0) as montantTotalDetention'),
                    'd.date_facturation as dateFacturationDetention',
                    'd.numero_facture as numeroFactureDetention',
                    DB::raw("CASE WHEN COALESCE(d.montant_total, 0) > 0 THEN 'paye' ELSE 'sans-frais' END as statutPaiement"),
                    'pa.date_paiement as dateArchivage'
                )
                ->orderBy('pa.date_paiement', 'desc')
                ->get();

            return $this->successResponse($archives, 'Archives récupérées avec succès');

        } catch (\Exception $e) {
            \Log::error('Erreur archives sorties: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return $this->errorResponse('Erreur lors de la récupération des archives: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Rechercher dans les archives de sorties
     */
    public function archivesSearch(Request $request): JsonResponse
    {
        try {
            $query = DB::table('prime_archives as pa')
                ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
                ->join('armateurs as a', 'sc.code_armateur', '=', 'a.code')
                ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_id')
                ->select(
                    'pa.id',
                    'sc.numero_conteneur as numeroConteneur',
                    'a.code as codeArmateur',
                    'pa.nom_client as nomClient',
                    'sc.date_sortie as dateSortiePort',
                    'sc.date_retour as dateRetourPort',
                    'sc.destination as destinationInitiale',
                    DB::raw('COALESCE(d.jours_bat, 0) as joursBAT'),
                    DB::raw('COALESCE(d.jours_realises, 0) as joursRealises'),
                    DB::raw('COALESCE(d.jours_depassement, 0) as joursDepassement'),
                    'd.responsabilite',
                    DB::raw('COALESCE(d.jours_client, 0) as joursClient'),
                    DB::raw('COALESCE(d.jours_logistiga, 0) as joursLogistiga'),
                    DB::raw('COALESCE(d.montant_total, 0) as montantTotalDetention'),
                    'd.date_facturation as dateFacturationDetention',
                    'd.numero_facture as numeroFactureDetention',
                    DB::raw("CASE WHEN COALESCE(d.montant_total, 0) > 0 THEN 'paye' ELSE 'sans-frais' END as statutPaiement"),
                    'pa.date_paiement as dateArchivage'
                );

            // Filtrer par dates
            if ($request->has('dateDebut')) {
                $query->where('pa.date_paiement', '>=', $request->dateDebut);
            }

            if ($request->has('dateFin')) {
                $query->where('pa.date_paiement', '<=', $request->dateFin);
            }

            // Filtrer par armateur
            if ($request->has('armateur') && $request->armateur !== '') {
                $query->where('a.code', 'like', '%' . $request->armateur . '%');
            }

            // Filtrer par client
            if ($request->has('client') && $request->client !== '') {
                $query->where('pa.nom_client', 'like', '%' . $request->client . '%');
            }

            // Filtrer par numéro de conteneur
            if ($request->has('numeroConteneur') && $request->numeroConteneur !== '') {
                $query->where('sc.numero_conteneur', 'like', '%' . $request->numeroConteneur . '%');
            }

            // Filtrer par statut de paiement
            if ($request->has('statutPaiement') && $request->statutPaiement !== '') {
                if ($request->statutPaiement === 'paye') {
                    $query->whereNotNull('d.id')->where('d.montant_total', '>', 0);
                } elseif ($request->statutPaiement === 'sans-frais') {
                    $query->where(function($q) {
                        $q->whereNull('d.id')
                          ->orWhere('d.montant_total', '=', 0);
                    });
                }
            }

            $archives = $query->orderBy('pa.date_paiement', 'desc')->get();

            return $this->successResponse($archives, 'Recherche effectuée avec succès');

        } catch (\Exception $e) {
            \Log::error('Erreur recherche archives: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return $this->errorResponse('Erreur lors de la recherche: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Statistiques des archives de sorties
     */
    public function archivesStats(Request $request): JsonResponse
    {
        try {
            $totalArchives = DB::table('prime_archives')->count();
            
            $avecDetention = DB::table('prime_archives as pa')
                ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
                ->join('detentions as d', 'sc.id', '=', 'd.sortie_id')
                ->where('d.montant_total', '>', 0)
                ->count();

            $montantTotal = DB::table('prime_archives as pa')
                ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
                ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_id')
                ->sum('d.montant_total') ?? 0;

            $stats = [
                'total_archives' => $totalArchives,
                'total_avec_detention' => $avecDetention,
                'total_sans_frais' => $totalArchives - $avecDetention,
                'montant_total_detention' => (float) $montantTotal,
            ];

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');

        } catch (\Exception $e) {
            \Log::error('Erreur stats archives: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage(), 500);
        }
    }

}
