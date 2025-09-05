<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Handle preflight OPTIONS requests
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $this->getAllowedOrigin($request))
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin, Cache-Control, Pragma')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);

        // Add CORS headers to actual requests
        $response->headers->set('Access-Control-Allow-Origin', $this->getAllowedOrigin($request));
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin, Cache-Control, Pragma');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }

    private function getAllowedOrigin(Request $request)
    {
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://b3b36859-40bc-4d2e-9dda-fa8b3af543d8.sandbox.lovable.dev',
            'https://b3b36859-40bc-4d2e-9dda-fa8b3af543d8.lovableproject.com',
            'https://id-preview--b3b36859-40bc-4d2e-9dda-fa8b3af543d8.lovable.app',
        ];

        $origin = $request->headers->get('origin');
        
        if (in_array($origin, $allowedOrigins)) {
            return $origin;
        }

        // Check patterns for Lovable domains
        if ($origin && (
            preg_match('/^https:\/\/.*\.lovableproject\.com$/', $origin) ||
            preg_match('/^https:\/\/.*\.lovable\.app$/', $origin) ||
            preg_match('/^https:\/\/.*--.*\.lovable\.app$/', $origin)
        )) {
            return $origin;
        }

        return $allowedOrigins[0]; // Default fallback
    }
}