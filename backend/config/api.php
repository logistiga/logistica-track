<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Endpoints Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration des endpoints API pour le système de gestion logistique
    |
    */

    'version' => 'v1',
    'prefix' => 'api',
    
    'endpoints' => [
        
        // Authentification
        'auth' => [
            'login' => 'POST /auth/login',
            'logout' => 'POST /auth/logout',
            'register' => 'POST /auth/register',
            'user' => 'GET /auth/user',
            'refresh' => 'POST /auth/refresh',
        ],
        
        // Sorties de Conteneurs
        'sorties' => [
            'index' => 'GET /sorties-conteneurs',
            'store' => 'POST /sorties-conteneurs',
            'show' => 'GET /sorties-conteneurs/{id}',
            'update' => 'PUT /sorties-conteneurs/{id}',
            'destroy' => 'DELETE /sorties-conteneurs/{id}',
            'retour' => 'POST /sorties-conteneurs/{id}/retour',
            'export' => 'GET /sorties-conteneurs/export',
            'stats' => 'GET /sorties-conteneurs/stats',
        ],
        
        // Armateurs
        'armateurs' => [
            'index' => 'GET /armateurs',
            'store' => 'POST /armateurs',
            'show' => 'GET /armateurs/{id}',
            'update' => 'PUT /armateurs/{id}',
            'destroy' => 'DELETE /armateurs/{id}',
        ],
        
        // Véhicules
        'vehicules' => [
            'index' => 'GET /vehicules',
            'store' => 'POST /vehicules',
            'show' => 'GET /vehicules/{id}',
            'update' => 'PUT /vehicules/{id}',
            'destroy' => 'DELETE /vehicules/{id}',
            'camions' => 'GET /vehicules/camions',
            'remorques' => 'GET /vehicules/remorques',
        ],
        
        // Opérations
        'operations' => [
            'index' => 'GET /operations',
            'store' => 'POST /operations',
            'show' => 'GET /operations/{id}',
            'update' => 'PUT /operations/{id}',
            'destroy' => 'DELETE /operations/{id}',
        ],
        
        // Utilisateurs
        'users' => [
            'index' => 'GET /users',
            'store' => 'POST /users',
            'show' => 'GET /users/{id}',
            'update' => 'PUT /users/{id}',
            'destroy' => 'DELETE /users/{id}',
        ],
        
        // Notifications
        'notifications' => [
            'index' => 'GET /notifications',
            'mark_read' => 'POST /notifications/{id}/read',
            'mark_all_read' => 'POST /notifications/read-all',
        ],
        
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Response Format
    |--------------------------------------------------------------------------
    */
    
    'response_format' => [
        'success' => [
            'status' => 'success',
            'data' => '{}',
            'message' => 'string',
            'meta' => [
                'pagination' => '{}',
                'total' => 'integer',
            ]
        ],
        'error' => [
            'status' => 'error',
            'message' => 'string',
            'errors' => '{}',
            'code' => 'integer'
        ]
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    */
    
    'rate_limiting' => [
        'auth' => '5:1', // 5 tentatives par minute
        'api' => '60:1', // 60 requêtes par minute
        'export' => '10:1', // 10 exports par minute
    ],
    
];