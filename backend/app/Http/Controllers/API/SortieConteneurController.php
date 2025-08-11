<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSortieConteneurRequest;
use App\Http\Requests\UpdateSortieConteneurRequest;
use App\Http\Requests\RetourSortieRequest;
use App\Http\Resources\SortieConteneurResource;
use App\Models\SortieConteneur;
use App\Services\SortieConteneurService;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SortieConteneurController extends Controller
{
    protected $sortieService;
    protected $exportService;

    public function __construct(
        SortieConteneurService $sortieService,
        ExportService $exportService
    ) {
        $this->sortieService = $sortieService;
        $this->exportService = $exportService;
    }

    /**
     * Lister toutes les sorties
     */
    public function index(Request $request)
    {
        $sorties = $this->sortieService->getAllSorties($request->all());

        return SortieConteneurResource::collection($sorties)->additional([
            'status' => 'success',
            'message' => 'Sorties récupérées avec succès'
        ]);
    }

    /**
     * Créer une nouvelle sortie
     */
    public function store(StoreSortieConteneurRequest $request)
    {
        $sortie = $this->sortieService->createSortie($request->validated());

        return new SortieConteneurResource($sortie);
    }

    /**
     * Afficher une sortie spécifique
     */
    public function show(SortieConteneur $sortieConteneur)
    {
        return new SortieConteneurResource($sortieConteneur->load([
            'armateur', 'camion', 'remorque', 'camionRetour', 'remorqueRetour'
        ]));
    }

    /**
     * Mettre à jour une sortie
     */
    public function update(UpdateSortieConteneurRequest $request, SortieConteneur $sortieConteneur)
    {
        $sortie = $this->sortieService->updateSortie($sortieConteneur, $request->validated());

        return new SortieConteneurResource($sortie);
    }

    /**
     * Supprimer une sortie
     */
    public function destroy(SortieConteneur $sortieConteneur)
    {
        $this->sortieService->deleteSortie($sortieConteneur);

        return response()->json([
            'status' => 'success',
            'message' => 'Sortie supprimée avec succès'
        ]);
    }

    /**
     * Confirmer le retour d'un conteneur
     */
    public function confirmerRetour(RetourSortieRequest $request, SortieConteneur $sortieConteneur)
    {
        $sortie = $this->sortieService->confirmerRetour($sortieConteneur, $request->validated());

        return new SortieConteneurResource($sortie);
    }

    /**
     * Exporter les sorties
     */
    public function export(Request $request)
    {
        $format = $request->get('format', 'excel'); // excel ou pdf
        $filters = $request->all();

        $file = $this->exportService->exportSorties($filters, $format);

        return response()->download($file)->deleteFileAfterSend();
    }

    /**
     * Statistiques des sorties
     */
    public function statistiques(Request $request)
    {
        $stats = $this->sortieService->getStatistiques($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}