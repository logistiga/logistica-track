<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArmateurRequest;
use App\Http\Requests\UpdateArmateurRequest;
use App\Http\Resources\ArmateurResource;
use App\Models\Armateur;
use App\Services\ArmateurService;
use Illuminate\Http\Request;

class ArmateurController extends Controller
{
    protected $armateurService;

    public function __construct(ArmateurService $armateurService)
    {
        $this->armateurService = $armateurService;
    }

    /**
     * Lister tous les armateurs
     */
    public function index(Request $request)
    {
        $armateurs = $this->armateurService->getAllArmateurs($request->all());

        return ArmateurResource::collection($armateurs)->additional([
            'status' => 'success',
            'message' => 'Armateurs récupérés avec succès'
        ]);
    }

    /**
     * Créer un nouvel armateur
     */
    public function store(StoreArmateurRequest $request)
    {
        $armateur = $this->armateurService->createArmateur($request->validated());

        return new ArmateurResource($armateur);
    }

    /**
     * Afficher un armateur spécifique
     */
    public function show(Armateur $armateur)
    {
        return new ArmateurResource($armateur->load('sorties'));
    }

    /**
     * Mettre à jour un armateur
     */
    public function update(UpdateArmateurRequest $request, Armateur $armateur)
    {
        $armateur = $this->armateurService->updateArmateur($armateur, $request->validated());

        return new ArmateurResource($armateur);
    }

    /**
     * Supprimer un armateur
     */
    public function destroy(Armateur $armateur)
    {
        $this->armateurService->deleteArmateur($armateur);

        return response()->json([
            'status' => 'success',
            'message' => 'Armateur supprimé avec succès'
        ]);
    }
}