<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTrait;
use App\Models\OrdreTravailExterne;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * Controller pour les webhooks entrants (depuis l'app de facturation)
 * Ces routes sont publiques mais protégées par API Key
 */
class WebhookController extends Controller
{
    use ApiResponseTrait;

    /**
     * Recevoir un ordre de travail depuis l'app de facturation
     * 
     * POST /api/webhook/ordres-externes
     * 
     * Body attendu:
     * {
     *   "booking_number": "BL123456",
     *   "client_nom": "Nom du client",
     *   "transitaire_nom": "Transitaire",
     *   "armateur_nom": "MSC",
     *   "containers": [
     *     { "numero_conteneur": "MSCU1234567" }
     *   ]
     * }
     */
    public function receiveOrdreTravail(Request $request): JsonResponse
    {
        // Vérifier l'API Key
        $apiKey = $request->header('X-API-Key') ?? $request->header('Authorization');
        $expectedKey = config('services.facturation.webhook_key');

        if ($expectedKey && $apiKey !== $expectedKey && $apiKey !== "Bearer {$expectedKey}") {
            Log::warning('Webhook: API Key invalide', [
                'ip' => $request->ip(),
                'headers' => $request->headers->all(),
            ]);
            return $this->errorResponse('API Key invalide', 401);
        }

        // Validation des données
        $validator = Validator::make($request->all(), [
            'booking_number' => 'required|string|max:100',
            'client_nom' => 'required|string|max:255',
            'transitaire_nom' => 'nullable|string|max:255',
            'armateur_nom' => 'nullable|string|max:255',
            'external_id' => 'nullable|string|max:100',
            'containers' => 'required|array|min:1',
            'containers.*.numero_conteneur' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            Log::warning('Webhook: Validation échouée', [
                'errors' => $validator->errors()->toArray(),
                'data' => $request->all(),
            ]);
            return $this->errorResponse('Données invalides', 422, $validator->errors());
        }

        try {
            $data = $validator->validated();

            // Vérifier si un ordre avec cet external_id existe déjà
            if (!empty($data['external_id'])) {
                $existing = OrdreTravailExterne::where('external_id', $data['external_id'])->first();
                if ($existing) {
                    Log::info('Webhook: Ordre existant trouvé', [
                        'external_id' => $data['external_id'],
                        'ordre_id' => $existing->id,
                    ]);
                    return $this->successResponse([
                        'id' => $existing->id,
                        'numero' => $existing->numero,
                        'status' => $existing->status,
                        'message' => 'Ordre existant',
                    ]);
                }
            }

            // Transformer les containers au format interne
            $containers = array_map(function ($c) {
                return [
                    'number' => $c['numero_conteneur'],
                    'type' => $c['type'] ?? null,
                    'description' => $c['description'] ?? null,
                ];
            }, $data['containers']);

            // Créer l'ordre
            $ordre = OrdreTravailExterne::create([
                'numero' => OrdreTravailExterne::generateNumero(),
                'external_id' => $data['external_id'] ?? null,
                'booking_number' => $data['booking_number'],
                'client_nom' => $data['client_nom'],
                'transitaire_nom' => $data['transitaire_nom'] ?? null,
                'armateur_nom' => $data['armateur_nom'] ?? null,
                'containers' => $containers,
                'date' => now()->toDateString(),
                'status' => 'brouillon',
                'source' => 'webhook_facturation',
            ]);

            Log::info('Webhook: Ordre créé', [
                'ordre_id' => $ordre->id,
                'numero' => $ordre->numero,
                'containers_count' => count($containers),
            ]);

            return $this->successResponse([
                'id' => $ordre->id,
                'numero' => $ordre->numero,
                'status' => $ordre->status,
                'containers_count' => count($containers),
                'message' => 'Ordre créé avec succès',
            ], 'Ordre reçu', 201);

        } catch (\Exception $e) {
            Log::error('Webhook: Erreur création ordre', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('Erreur interne', 500, $e->getMessage());
        }
    }

    /**
     * Health check pour le webhook
     */
    public function health(): JsonResponse
    {
        return $this->successResponse([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'service' => 'logistiga_ops_webhook',
        ]);
    }
}
