<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ConteneurTraite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ConteneurTraiteController extends Controller
{
    /**
     * Recevoir un conteneur traité depuis l'app OPS (Logistiga)
     * POST /api/conteneurs-traites
     */
    public function store(Request $request): JsonResponse
    {
        // Valider la clé API
        $apiKey = $request->header('X-API-Key');
        $expectedKey = config('services.logistiga.api_key');

        if (!$apiKey || $apiKey !== $expectedKey) {
            Log::warning('ConteneurTraite: Clé API invalide', [
                'ip' => $request->ip(),
                'provided_key' => substr($apiKey ?? '', 0, 10) . '...',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Clé API invalide',
            ], 401);
        }

        // Valider les données
        $validator = Validator::make($request->all(), [
            'numero_conteneur' => 'required|string|max:20',
            'numero_bl' => 'nullable|string|max:100',
            'nom_client' => 'required|string|max:255',
            'code_armateur' => 'nullable|string|max:50',
            'type_conteneur' => 'nullable|string|max:10',
            'date_sortie' => 'nullable|date',
            'date_retour' => 'nullable|date',
            'chauffeur' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'observations' => 'nullable|string|max:1000',
            'jours_detention' => 'nullable|integer|min:0',
            'montant_detention' => 'nullable|numeric|min:0',
            'source_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Vérifier si ce conteneur existe déjà (éviter les doublons)
        $existing = ConteneurTraite::where('numero_conteneur', $data['numero_conteneur'])
            ->where('source_id', $data['source_id'] ?? null)
            ->first();

        if ($existing) {
            // Mise à jour si déjà existant
            $existing->update($data);

            Log::info('ConteneurTraite: Conteneur mis à jour', [
                'id' => $existing->id,
                'numero' => $data['numero_conteneur'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conteneur mis à jour',
                'data' => [
                    'id' => $existing->id,
                    'numero_conteneur' => $existing->numero_conteneur,
                    'updated' => true,
                ],
            ]);
        }

        // Créer le nouveau conteneur traité
        $conteneur = ConteneurTraite::create(array_merge($data, [
            'status' => 'recu',
            'received_at' => now(),
        ]));

        Log::info('ConteneurTraite: Nouveau conteneur reçu', [
            'id' => $conteneur->id,
            'numero' => $conteneur->numero_conteneur,
            'client' => $conteneur->nom_client,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Conteneur reçu avec succès',
            'data' => [
                'id' => $conteneur->id,
                'numero_conteneur' => $conteneur->numero_conteneur,
                'created' => true,
            ],
        ], 201);
    }

    /**
     * Liste des conteneurs traités reçus
     * GET /api/conteneurs-traites
     */
    public function index(Request $request): JsonResponse
    {
        $query = ConteneurTraite::query();

        // Filtres optionnels
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('client')) {
            $query->where('nom_client', 'like', '%' . $request->client . '%');
        }

        if ($request->has('date_from')) {
            $query->whereDate('received_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('received_at', '<=', $request->date_to);
        }

        $conteneurs = $query->orderBy('received_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $conteneurs,
        ]);
    }

    /**
     * Détails d'un conteneur traité
     * GET /api/conteneurs-traites/{id}
     */
    public function show(int $id): JsonResponse
    {
        $conteneur = ConteneurTraite::find($id);

        if (!$conteneur) {
            return response()->json([
                'success' => false,
                'message' => 'Conteneur non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $conteneur,
        ]);
    }

    /**
     * Marquer un conteneur comme facturé
     * POST /api/conteneurs-traites/{id}/facturer
     */
    public function facturer(Request $request, int $id): JsonResponse
    {
        $conteneur = ConteneurTraite::find($id);

        if (!$conteneur) {
            return response()->json([
                'success' => false,
                'message' => 'Conteneur non trouvé',
            ], 404);
        }

        $conteneur->update([
            'status' => 'facture',
            'facture_id' => $request->input('facture_id'),
            'factured_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Conteneur marqué comme facturé',
            'data' => $conteneur,
        ]);
    }
}
