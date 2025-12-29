<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ExternalLogistiqueApiService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('external-api.base_url');
        $this->apiKey = config('external-api.api_key');
        $this->timeout = config('external-api.timeout', 30);
    }

    /**
     * Effectue une requête HTTP vers l'API externe
     */
    protected function request(string $method, string $endpoint, array $data = []): array
    {
        $url = $this->baseUrl . $endpoint;

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'X-API-Key' => $this->apiKey,
                ])
                ->retry(
                    config('external-api.retry.times', 3),
                    config('external-api.retry.sleep', 100)
                )
                ->{$method}($url, $data);

            if ($response->failed()) {
                Log::error('[ExternalLogistiqueAPI] Erreur', [
                    'url' => $url,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);

                return [
                    'success' => false,
                    'message' => $response->json('message') ?? 'Erreur API externe',
                    'errors' => $response->json('errors'),
                ];
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('[ExternalLogistiqueAPI] Exception', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Erreur de connexion à l\'API externe: ' . $e->getMessage(),
            ];
        }
    }

    // === HEALTH CHECK ===

    public function checkHealth(): array
    {
        return $this->request('get', '/health');
    }

    public function getStats(): array
    {
        return Cache::remember('external_api_stats', 300, function () {
            return $this->request('get', '/stats');
        });
    }

    // === CLIENTS ===

    public function getClients(array $params = []): array
    {
        $query = http_build_query($params);
        $endpoint = '/clients' . ($query ? "?{$query}" : '');
        return $this->request('get', $endpoint);
    }

    public function getClient(int $id): array
    {
        return $this->request('get', "/clients/{$id}");
    }

    public function createClient(array $data): array
    {
        return $this->request('post', '/clients', $data);
    }

    public function updateClient(int $id, array $data): array
    {
        return $this->request('put', "/clients/{$id}", $data);
    }

    // === ORDRES DE TRAVAIL ===

    public function getOrdresTravail(array $params = []): array
    {
        $query = http_build_query($params);
        $endpoint = '/ordres-travail' . ($query ? "?{$query}" : '');
        return $this->request('get', $endpoint);
    }

    public function getOrdreTravail(int $id): array
    {
        return $this->request('get', "/ordres-travail/{$id}");
    }

    public function createOrdreTravail(array $data): array
    {
        Cache::forget('external_api_stats');
        return $this->request('post', '/ordres-travail', $data);
    }

    public function updateOrdreTravail(int $id, array $data): array
    {
        return $this->request('put', "/ordres-travail/{$id}", $data);
    }

    public function updateOrdreTravailStatus(int $id, string $status, ?string $notes = null): array
    {
        Cache::forget('external_api_stats');
        return $this->request('put', "/ordres-travail/{$id}/status", [
            'status' => $status,
            'notes' => $notes,
        ]);
    }

    // === FACTURES ===

    public function getInvoices(array $params = []): array
    {
        $query = http_build_query($params);
        $endpoint = '/invoices' . ($query ? "?{$query}" : '');
        return $this->request('get', $endpoint);
    }

    public function getInvoice(int $id): array
    {
        return $this->request('get', "/invoices/{$id}");
    }

    // === CONTENEURS ===

    /**
     * Envoie des conteneurs à l'API externe
     * Les conteneurs avec le même booking_number seront groupés en un seul ordre de travail
     */
    public function sendContainers(array $data): array
    {
        Cache::forget('external_api_stats');
        return $this->request('post', '/containers', $data);
    }

    /**
     * Prépare et envoie les conteneurs depuis les sorties de conteneurs
     */
    public function sendContainersFromSorties(array $sorties): array
    {
        $grouped = collect($sorties)->groupBy('numero_bl');
        
        $results = [];
        
        foreach ($grouped as $bookingNumber => $containers) {
            $firstContainer = $containers->first();
            
            $payload = [
                'client_name' => $firstContainer['nom_client'],
                'vessel_name' => $firstContainer['vessel_name'] ?? null,
                'shipping_line' => $firstContainer['code_armateur'],
                'containers' => $containers->map(fn($c) => [
                    'booking_number' => $c['numero_bl'],
                    'container_number' => $c['numero_conteneur'],
                ])->values()->toArray(),
            ];
            
            $results[$bookingNumber] = $this->sendContainers($payload);
        }
        
        return $results;
    }
}
