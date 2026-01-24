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
     * Envoyer les données minimales d'une nouvelle sortie créée
     * Format conforme aux spécifications de l'app Facturation
     */
    public function envoyerNouvelleSortie(SortieConteneur $sortie): array
    {
        // Format structuré selon les specs Facturation
        $payload = [
            'numero_conteneur' => $sortie->numero_conteneur,
            'sortie_id' => $sortie->id,
            'numero_bl' => $sortie->numero_bl,
            'source_system' => 'logistiga_ops',
            'client' => [
                'nom' => $sortie->nom_client,
            ],
            'dates' => [
                'sortie' => $sortie->date_sortie?->format('Y-m-d'),
            ],
        ];

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($this->getHeaders())
                ->post("{$this->baseUrl}/api/conteneurs-traites", $payload);

            if ($response->successful()) {
                // Marquer comme synchronisé
                $sortie->update(['synced_to_facturation_at' => now()]);
                
                Log::info('Nouvelle sortie envoyée à facturation', [
                    'sortie_id' => $sortie->id,
                    'numero_conteneur' => $sortie->numero_conteneur,
                ]);

                return [
                    'success' => true,
                    'message' => 'Sortie synchronisée',
                    'data' => $response->json(),
                ];
            }

            Log::error('Échec sync nouvelle sortie', [
                'sortie_id' => $sortie->id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Marquer l'échec
            $sortie->update(['sync_facturation_failed' => true]);

            return [
                'success' => false,
                'message' => 'Erreur lors de la synchronisation',
                'error' => $response->json()['message'] ?? $response->body(),
            ];

        } catch (\Exception $e) {
            Log::warning('Exception sync nouvelle sortie', [
                'sortie_id' => $sortie->id,
                'error' => $e->getMessage(),
            ]);

            // Marquer l'échec silencieusement
            try {
                $sortie->update(['sync_facturation_failed' => true]);
            } catch (\Exception $updateException) {
                // Ignorer si la colonne n'existe pas encore
            }

            return [
                'success' => false,
                'message' => 'Erreur de connexion',
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
     * Format conforme aux spécifications de l'app Facturation
     */
    private function preparerPayload(SortieConteneur $sortie): array
    {
        return [
            // Champs obligatoires et recommandés en premier
            'numero_conteneur' => $sortie->numero_conteneur,
            'sortie_id' => $sortie->id,
            'numero_bl' => $sortie->numero_bl,
            'source_system' => 'logistiga_ops',
            'statut' => $sortie->statut,
            
            // Armateur
            'armateur' => [
                'code' => $sortie->code_armateur,
                'nom' => $sortie->armateur?->nom ?? $sortie->code_armateur,
            ],
            
            // Client
            'client' => [
                'nom' => $sortie->nom_client,
                'adresse' => $sortie->adresse_client,
            ],
            
            // Transitaire
            'transitaire' => [
                'nom' => $sortie->nom_transitaire,
            ],
            
            // Dates (format YYYY-MM-DD)
            'dates' => [
                'sortie' => $sortie->date_sortie?->format('Y-m-d'),
                'retour' => $sortie->date_retour?->format('Y-m-d'),
            ],
            
            // Véhicule (utiliser immatriculation comme plaque)
            'vehicule' => [
                'camion' => [
                    'id' => $sortie->camion_id,
                    'plaque' => $sortie->camion?->immatriculation ?? $sortie->camion?->numero_parc,
                ],
                'remorque' => [
                    'id' => $sortie->remorque_id,
                    'plaque' => $sortie->remorque?->immatriculation ?? $sortie->remorque?->numero_parc,
                ],
            ],
            
            // Chauffeur
            'chauffeur' => [
                'nom' => null, // Pas de relation chauffeur directe dans le modèle actuel
                'prime' => $sortie->prime_chauffeur,
            ],
            
            // Destination
            'destination' => [
                'type' => $sortie->type_destination ?? $sortie->destination,
                'adresse' => $sortie->adresse_client,
            ],
        ];
    }

    /**
     * Headers pour les requêtes vers facturation
     * Envoie les deux formats d'auth pour compatibilité maximale
     */
    private function getHeaders(): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-Source' => 'logistiga_ops',
        ];

        if ($this->apiKey) {
            // Envoyer les DEUX headers pour compatibilité avec les specs Facturation
            $headers['X-API-Key'] = $this->apiKey;
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
