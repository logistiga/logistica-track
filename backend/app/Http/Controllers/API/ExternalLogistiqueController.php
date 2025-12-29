<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SortieConteneur;
use App\Services\ExternalLogistiqueApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExternalLogistiqueController extends Controller
{
    protected ExternalLogistiqueApiService $apiService;

    public function __construct(ExternalLogistiqueApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    // === HEALTH & STATS ===

    public function health(): JsonResponse
    {
        $result = $this->apiService->checkHealth();
        return response()->json($result, $result['success'] ?? false ? 200 : 503);
    }

    public function stats(): JsonResponse
    {
        $result = $this->apiService->getStats();
        return response()->json($result);
    }

    // === CLIENTS ===

    public function getClients(Request $request): JsonResponse
    {
        $params = $request->only(['search', 'page', 'per_page']);
        $result = $this->apiService->getClients($params);
        return response()->json($result);
    }

    public function getClient(int $id): JsonResponse
    {
        $result = $this->apiService->getClient($id);
        return response()->json($result, $result['success'] ?? false ? 200 : 404);
    }

    public function createClient(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:50',
            'adresse' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->createClient($validator->validated());
        return response()->json($result, $result['success'] ?? false ? 201 : 400);
    }

    public function updateClient(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'nullable|string|max:50',
            'adresse' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->updateClient($id, $validator->validated());
        return response()->json($result);
    }

    // === ORDRES DE TRAVAIL ===

    public function getOrdresTravail(Request $request): JsonResponse
    {
        $params = $request->only(['status', 'client_id', 'date_from', 'date_to', 'page', 'per_page']);
        $result = $this->apiService->getOrdresTravail($params);
        return response()->json($result);
    }

    public function getOrdreTravail(int $id): JsonResponse
    {
        $result = $this->apiService->getOrdreTravail($id);
        return response()->json($result, $result['success'] ?? false ? 200 : 404);
    }

    public function createOrdreTravail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|integer',
            'date' => 'required|date',
            'type' => 'required|string|max:100',
            'reference' => 'nullable|string|max:100',
            'booking_number' => 'nullable|string|max:100',
            'vessel_name' => 'nullable|string|max:255',
            'containers' => 'nullable|array',
            'containers.*.number' => 'required_with:containers|string|max:20',
            'containers.*.type' => 'required_with:containers|string|max:10',
            'lignes_prestations' => 'nullable|array',
            'lignes_prestations.*.description' => 'required_with:lignes_prestations|string|max:500',
            'lignes_prestations.*.quantite' => 'required_with:lignes_prestations|numeric|min:0',
            'lignes_prestations.*.prix_unitaire' => 'required_with:lignes_prestations|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->createOrdreTravail($validator->validated());
        return response()->json($result, $result['success'] ?? false ? 201 : 400);
    }

    public function updateOrdreTravail(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date',
            'type' => 'sometimes|string|max:100',
            'reference' => 'nullable|string|max:100',
            'booking_number' => 'nullable|string|max:100',
            'vessel_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->updateOrdreTravail($id, $validator->validated());
        return response()->json($result);
    }

    public function updateOrdreTravailStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:brouillon,en_cours,termine,facture',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->updateOrdreTravailStatus(
            $id,
            $request->input('status'),
            $request->input('notes')
        );

        return response()->json($result);
    }

    // === FACTURES ===

    public function getInvoices(Request $request): JsonResponse
    {
        $params = $request->only(['status', 'client_id', 'page', 'per_page']);
        $result = $this->apiService->getInvoices($params);
        return response()->json($result);
    }

    public function getInvoice(int $id): JsonResponse
    {
        $result = $this->apiService->getInvoice($id);
        return response()->json($result, $result['success'] ?? false ? 200 : 404);
    }

    // === CONTENEURS ===

    public function sendContainers(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_name' => 'required|string|max:255',
            'vessel_name' => 'nullable|string|max:255',
            'shipping_line' => 'required|string|max:50',
            'containers' => 'required|array|min:1',
            'containers.*.booking_number' => 'required|string|max:100',
            'containers.*.container_number' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->apiService->sendContainers($validator->validated());
        return response()->json($result, $result['success'] ?? false ? 201 : 400);
    }

    public function sendContainersBatch(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sortie_ids' => 'required|array|min:1',
            'sortie_ids.*' => 'integer|exists:sortie_conteneurs,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $sorties = SortieConteneur::with('armateur')
            ->whereIn('id', $request->sortie_ids)
            ->get()
            ->map(fn($s) => [
                'numero_conteneur' => $s->numero_conteneur,
                'numero_bl' => $s->numero_bl,
                'nom_client' => $s->nom_client,
                'code_armateur' => $s->armateur?->nom ?? $s->code_armateur,
            ])
            ->toArray();

        $result = $this->apiService->sendContainersFromSorties($sorties);

        return response()->json([
            'success' => true,
            'message' => 'Conteneurs envoyés avec succès',
            'data' => $result,
        ]);
    }
}
