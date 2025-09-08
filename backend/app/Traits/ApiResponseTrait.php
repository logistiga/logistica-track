<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponseTrait
{
    /**
     * Réponse succès standardisée.
     */
    protected function successResponse(
        $data = null,
        string $message = 'Succès',
        int $status = 200,
        array $extra = [] // pour meta/links/etc
    ): JsonResponse {
        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if (!empty($extra)) {
            // On accepte meta/links/whatever dans $extra
            $payload = array_merge($payload, $extra);
        }

        return response()->json($payload, $status);
    }

    /**
     * Réponse erreur standardisée.
     */
    protected function errorResponse(
        string $message = 'Erreur',
        int $status = 500,
        $errors = null
    ): JsonResponse {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if (!is_null($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }

    protected function validationErrorResponse($validator)
    {
        return $this->errorResponse(
            'Erreurs de validation',
            422,
            $validator->errors()
        );
    }

    protected function notFoundResponse($message = 'Ressource non trouvée')
    {
        return $this->errorResponse($message, 404);
    }

    protected function unauthorizedResponse($message = 'Non autorisé')
    {
        return $this->errorResponse($message, 401);
    }

    protected function forbiddenResponse($message = 'Accès interdit')
    {
        return $this->errorResponse($message, 403);
    }
}