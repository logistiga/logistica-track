<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service pour la synchronisation bidirectionnelle avec l'app de facturation
 * 
 * Envoi des conteneurs traités vers : POST https://facturation.logistiga.com/api/conteneurs-traites
 */
class FacturationSyncService
{
    private string $baseUrl;
    private ?string $apiKey;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.facturation.url', 'https://facturation.logistiga.com'), '/');
        $this->apiKey = config('services.facturation.api_key');
        $this->timeout = (int) config('services.facturation.timeout', 30);
    }

    /**
     * Envoyer un conteneur traité vers l'app de facturation
     */
    public function envoyerConteneurTraite(SortieConteneur $sortie): array
    {
        $payload = $this->preparerPayload($sortie);

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post("{$this->baseUrl}/api/conteneurs-traites", $payload);

            if ($response->successful()) {
                Log::info('Conteneur envoyé à facturation', [
                    'sortie_id' => $sortie->id,
                    'numero_conteneur' => $sortie->numero_conteneur,
                    'response' => $response->json(),
                ]);

                return [
                    'success' => true,
                    'message' => 'Conteneur synchronisé avec facturation',
                    'data' => $response->json(),
                ];
            }

            Log::error('Échec envoi conteneur à facturation', [
                'sortie_id' => $sortie->id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'message' => 'Erreur lors de la synchronisation',
                'error' => $response->json()['message'] ?? $response->body(),
            ];

        } catch (\Exception $e) {
            Log::error('Exception envoi conteneur à facturation', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de connexion à l\'app de facturation',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Envoyer plusieurs conteneurs en batch
     */
    public function envoyerConteneursEnLot(array $sorties): array
    {
        $results = [];

        foreach ($sorties as $sortie) {
            if ($sortie instanceof SortieConteneur) {
                $results[$sortie->id] = $this->envoyerConteneurTraite($sortie);
            }
        }

        $success = collect($results)->where('success', true)->count();
        $failed = collect($results)->where('success', false)->count();

        return [
            'success' => $failed === 0,
            'message' => "Synchronisation terminée: {$success} réussis, {$failed} échecs",
            'details' => $results,
        ];
    }

    /**
     * Préparer le payload pour l'envoi vers facturation
     */
    private function preparerPayload(SortieConteneur $sortie): array
    {
        return [
            'numero_conteneur' => $sortie->numero_conteneur,
            'numero_bl' => $sortie->numero_bl,
            'armateur' => [
                'code' => $sortie->code_armateur,
                'nom' => $sortie->armateur?->nom ?? $sortie->code_armateur,
            ],
            'client' => [
                'nom' => $sortie->nom_client,
                'adresse' => $sortie->adresse_client,
            ],
            'transitaire' => [
                'nom' => $sortie->nom_transitaire,
            ],
            'dates' => [
                'sortie' => $sortie->date_sortie?->format('Y-m-d'),
                'retour' => $sortie->date_retour?->format('Y-m-d'),
            ],
            'vehicule' => [
                'camion' => [
                    'id' => $sortie->camion_id,
                    'plaque' => $sortie->camion?->numero_parc ?? null,
                ],
                'remorque' => [
                    'id' => $sortie->remorque_id,
                    'plaque' => $sortie->remorque?->numero_parc ?? null,
                ],
            ],
            'chauffeur' => [
                'nom' => $sortie->camion?->chauffeur ?? null,
                'prime' => $sortie->prime_chauffeur,
            ],
            'destination' => [
                'type' => $sortie->destination,
                'adresse' => $sortie->adresse_client,
            ],
            'statut' => $sortie->statut,
            'source_system' => 'logistiga_ops',
            'sortie_id' => $sortie->id,
            'synced_at' => now()->toISOString(),
        ];
    }

    /**
     * Headers pour les requêtes vers facturation
     */
    private function getHeaders(): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-Source' => 'logistiga_ops',
        ];

        if ($this->apiKey) {
            $headers['Authorization'] = "Bearer {$this->apiKey}";
        }

        return $headers;
    }

    /**
     * Vérifier la connectivité avec l'app de facturation
     */
    public function checkHealth(): array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders($this->getHeaders())
                ->get("{$this->baseUrl}/api/health");

            return [
                'connected' => $response->successful(),
                'status' => $response->status(),
                'message' => $response->successful() ? 'Connecté' : 'Erreur de connexion',
            ];
        } catch (\Exception $e) {
            return [
                'connected' => false,
                'status' => 0,
                'message' => $e->getMessage(),
            ];
        }
    }
}
