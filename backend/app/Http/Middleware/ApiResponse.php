<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ApiResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Si c'est une réponse JSON qui n'a pas de structure standardisée
        if ($response->headers->get('Content-Type') === 'application/json' && 
            is_string($response->getContent())) {
            
            $content = json_decode($response->getContent(), true);
            
            // Si ce n'est pas déjà formaté
            if (!isset($content['status'])) {
                $formattedContent = [
                    'status' => $response->getStatusCode() >= 200 && $response->getStatusCode() < 300 ? 'success' : 'error',
                    'data' => $content,
                    'message' => '',
                ];
                
                $response->setContent(json_encode($formattedContent));
            }
        }

        return $response;
    }
}