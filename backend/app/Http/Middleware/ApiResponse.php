<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Ne jamais emballer les streams/fichiers
        if ($response instanceof StreamedResponse || $response instanceof BinaryFileResponse) {
            return $response;
        }

        // Si le contrôleur a déjà renvoyé du JSON, ne pas re-encoder
        if ($response instanceof JsonResponse) {
            return $response;
        }

        $status = $response->getStatusCode();

        // Laisse passer les erreurs (≥400) sans toucher
        if ($status >= 400) {
            return $response;
        }

        // Récupère le contenu "original"
        $original = method_exists($response, 'getOriginalContent')
            ? $response->getOriginalContent()
            : $response->getContent();

        // ⚠️ AUCUN appel à auth() ici
        return response()->json([
            'status' => 'success',
            'data'   => $original,
        ], $status, $response->headers->all());
    }
}