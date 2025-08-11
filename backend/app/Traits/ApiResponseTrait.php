<?php

namespace App\Traits;

trait ApiResponseTrait
{
    protected function successResponse($data = null, $message = '', $statusCode = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function errorResponse($message = '', $errors = null, $statusCode = 400)
    {
        $response = [
            'status' => 'error',
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    protected function validationErrorResponse($validator)
    {
        return $this->errorResponse(
            'Erreurs de validation',
            $validator->errors(),
            422
        );
    }

    protected function notFoundResponse($message = 'Ressource non trouvée')
    {
        return $this->errorResponse($message, null, 404);
    }

    protected function unauthorizedResponse($message = 'Non autorisé')
    {
        return $this->errorResponse($message, null, 401);
    }

    protected function forbiddenResponse($message = 'Accès interdit')
    {
        return $this->errorResponse($message, null, 403);
    }
}