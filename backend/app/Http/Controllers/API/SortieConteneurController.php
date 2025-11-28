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
            // Vérifier que la sortie est retournée au port
            if ($sortie->statut !== 'retourne_port') {
                return $this->errorResponse('Seules les sorties retournées au port peuvent être archivées', 400);
            }

            // Vérifier que les champs obligatoires sont remplis
            if (!$sortie->pv_sortie || !$sortie->pv_rentree_port || !$sortie->numero_ordre) {
                return $this->errorResponse('Les champs PV Sortie, PV Rentrée et N° Ordre sont obligatoires', 400);
            }

            DB::beginTransaction();

            // Récupérer le chauffeur (nom du camion/véhicule)
            $camion = $sortie->camion;
            $chauffeur = $camion ? $camion->libelle_complet : 'Non défini';

            // Créer l'archive
            DB::table('prime_archives')->insert([
                'sortie_id' => $sortie->id,
                'numero_conteneur' => $sortie->numero_conteneur,
                'chauffeur' => $chauffeur,
                'montant_prime' => $sortie->prime_chauffeur ?? 0,
                'date_sortie' => $sortie->date_sortie,
                'date_paiement' => now(),
                'numero_semaine' => date('W'),
                'nom_client' => $sortie->nom_client,
                'observations' => 'Archivé depuis Ordre - PV Sortie: ' . $sortie->pv_sortie . ', PV Rentrée: ' . $sortie->pv_rentree_port . ', N° Ordre: ' . $sortie->numero_ordre,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Changer le statut de la sortie à 'archive'
            $sortie->update(['statut' => 'archive']);

            $this->cacheService->invalidateAllCaches();

            // Logger l'activité
            logActivity('sortie_archived', $sortie, 'Sortie archivée depuis Ordre');

            DB::commit();

            return $this->successResponse(
                new SortieConteneurResource($sortie->load(['armateur', 'camion', 'remorque'])),
                'Sortie archivée avec succès'
            );

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('❌ Error archiving sortie', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Erreur lors de l\'archivage de la sortie: ' . $e->getMessage(), 500);
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
                ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_conteneur_id')
                ->leftJoin('vehicules as vc', 'sc.camion_id', '=', 'vc.id')
                ->leftJoin('vehicules as vr', 'sc.remorque_id', '=', 'vr.id')
                ->select(
                    'pa.id',
                    'sc.numero_conteneur as numeroConteneur',
                    'a.code as codeArmateur',
                    'a.type_conteneur as typeConteneur',
                    'pa.nom_client as nomClient',
                    'sc.date_sortie as dateSortiePort',
                    'sc.date_retour as dateRetourPort',
                    'sc.destination as destinationInitiale',
                    'a.jours_gratuits as joursBAT',
                    DB::raw('DATEDIFF(sc.date_retour, sc.date_sortie) as joursRealises'),
                    DB::raw('GREATEST(DATEDIFF(sc.date_retour, sc.date_sortie) - a.jours_gratuits, 0) as joursDepassement'),
                    'd.responsabilite',
                    DB::raw('COALESCE(d.jours_client, 0) as joursClient'),
                    DB::raw('COALESCE(d.jours_logistiga, 0) as joursLogistiga'),
                    DB::raw('COALESCE(d.cout_total, 0) as montantTotalDetention'),
                    DB::raw("CASE WHEN d.id IS NOT NULL AND COALESCE(d.cout_total, 0) > 0 THEN 'paye' ELSE 'sans-frais' END as statutPaiement"),
                    'pa.montant_prime as montantPrime',
                    'vc.immatriculation as camion',
                    'vr.immatriculation as remorque',
                    'pa.chauffeur',
                    'sc.numero_bl as numeroBL',
                    'sc.nom_transitaire as nomTransitaire',
                    'sc.numero_ordre as numeroOrdre',
                    'sc.pv_sortie as pvSortie',
                    'sc.pv_rentree_port as pvRentreePort',
                    'pa.observations',
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
                ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_conteneur_id')
                ->leftJoin('vehicules as vc', 'sc.camion_id', '=', 'vc.id')
                ->leftJoin('vehicules as vr', 'sc.remorque_id', '=', 'vr.id')
                ->select(
                    'pa.id',
                    'sc.numero_conteneur as numeroConteneur',
                    'a.code as codeArmateur',
                    'a.type_conteneur as typeConteneur',
                    'pa.nom_client as nomClient',
                    'sc.date_sortie as dateSortiePort',
                    'sc.date_retour as dateRetourPort',
                    'sc.destination as destinationInitiale',
                    'a.jours_gratuits as joursBAT',
                    DB::raw('DATEDIFF(sc.date_retour, sc.date_sortie) as joursRealises'),
                    DB::raw('GREATEST(DATEDIFF(sc.date_retour, sc.date_sortie) - a.jours_gratuits, 0) as joursDepassement'),
                    'd.responsabilite',
                    DB::raw('COALESCE(d.jours_client, 0) as joursClient'),
                    DB::raw('COALESCE(d.jours_logistiga, 0) as joursLogistiga'),
                    DB::raw('COALESCE(d.cout_total, 0) as montantTotalDetention'),
                    DB::raw("CASE WHEN d.id IS NOT NULL AND COALESCE(d.cout_total, 0) > 0 THEN 'paye' ELSE 'sans-frais' END as statutPaiement"),
                    'pa.montant_prime as montantPrime',
                    'vc.immatriculation as camion',
                    'vr.immatriculation as remorque',
                    'pa.chauffeur',
                    'sc.numero_bl as numeroBL',
                    'sc.nom_transitaire as nomTransitaire',
                    'sc.numero_ordre as numeroOrdre',
                    'sc.pv_sortie as pvSortie',
                    'sc.pv_rentree_port as pvRentreePort',
                    'pa.observations',
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
                    $query->whereNotNull('d.id')->where('d.cout_total', '>', 0);
                } elseif ($request->statutPaiement === 'sans-frais') {
                    $query->where(function($q) {
                        $q->whereNull('d.id')
                          ->orWhere('d.cout_total', '=', 0);
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
