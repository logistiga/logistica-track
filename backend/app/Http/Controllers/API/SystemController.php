<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    use ApiResponseTrait;

    /**
     * Get system information
     */
    public function info(): JsonResponse
    {
        try {
            $info = [
                'app_name' => config('app.name'),
                'app_version' => '1.0.0',
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => config('app.env'),
                'debug_mode' => config('app.debug'),
                'timezone' => config('app.timezone'),
            ];

            return $this->successResponse($info);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations système', 500);
        }
    }

    /**
     * Test CORS configuration
     */
    public function corsTest(\Illuminate\Http\Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'CORS is working correctly',
            'origin' => $request->headers->get('origin'),
            'method' => $request->method(),
            'timestamp' => now()->toISOString(),
            'cors_headers_will_be_added_by_middleware' => true,
        ], 200);
    }

    /**
     * Get system health status
     */
    public function health(): JsonResponse
    {
        try {
            $health = [
                'status' => 'ok',
                'timestamp' => now()->toISOString(),
                'checks' => [
                    'database' => $this->checkDatabase(),
                    'cache' => $this->checkCache(),
                    'storage' => $this->checkStorage(),
                ]
            ];

            $allHealthy = collect($health['checks'])->every(fn($check) => $check['status'] === 'ok');
            $health['status'] = $allHealthy ? 'ok' : 'warning';

            return $this->successResponse($health);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la vérification de la santé du système', 500);
        }
    }

    /**
     * Check database connectivity
     */
    private function checkDatabase(): array
    {
        try {
            \DB::connection()->getPdo();
            return ['status' => 'ok', 'message' => 'Database connection successful'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Database connection failed'];
        }
    }

    /**
     * Check cache functionality
     */
    private function checkCache(): array
    {
        try {
            $testKey = 'health_check_' . time();
            cache()->put($testKey, 'test', 60);
            $value = cache()->get($testKey);
            cache()->forget($testKey);
            
            return $value === 'test' 
                ? ['status' => 'ok', 'message' => 'Cache is working']
                : ['status' => 'error', 'message' => 'Cache test failed'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Cache error: ' . $e->getMessage()];
        }
    }

    /**
     * Check storage accessibility
     */
    private function checkStorage(): array
    {
        try {
            $storagePath = storage_path('app');
            return is_writable($storagePath)
                ? ['status' => 'ok', 'message' => 'Storage is writable']
                : ['status' => 'error', 'message' => 'Storage is not writable'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Storage error: ' . $e->getMessage()];
        }
    }
}