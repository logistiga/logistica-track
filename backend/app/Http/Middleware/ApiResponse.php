<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ApiResponse
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $response = $next($request);
            
            // Vérifier si la réponse est déjà au bon format
            if ($response->headers->get('Content-Type') === 'application/json') {
                $content = $response->getContent();
                
                if ($content && is_string($content)) {
                    $decoded = json_decode($content, true);
                    
                    // Si la réponse n'est pas déjà formatée avec 'status'
                    if (is_array($decoded) && !isset($decoded['status'])) {
                        $statusCode = $response->getStatusCode();
                        $formattedContent = [
                            'status' => ($statusCode >= 200 && $statusCode < 300) ? 'success' : 'error',
                            'data' => $decoded,
                            'message' => '',
                        ];
                        
                        $response->setContent(json_encode($formattedContent));
                    }
                }
            }

            return $response;
        } catch (\Exception $e) {
            // En cas d'erreur dans le middleware, retourner une réponse JSON d'erreur
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => 'Une erreur s\'est produite lors du traitement de la requête.',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur serveur'
            ], 500);
        }
    }
}