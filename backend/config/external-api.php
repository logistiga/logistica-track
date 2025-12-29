<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuration de l'API Externe Logistique
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'intégration avec l'API externe de gestion logistique
    |
    */

    'base_url' => env('EXTERNAL_LOGISTIQUE_API_URL', 'https://d16b9f7b-d97a-41e1-b5d0-a72f0873dc6d.lovable.app/api/external'),
    
    'api_key' => env('EXTERNAL_LOGISTIQUE_API_KEY', ''),
    
    'timeout' => env('EXTERNAL_LOGISTIQUE_API_TIMEOUT', 30),
    
    'retry' => [
        'times' => 3,
        'sleep' => 100, // milliseconds
    ],

    'endpoints' => [
        'health' => '/health',
        'stats' => '/stats',
        'clients' => '/clients',
        'ordres_travail' => '/ordres-travail',
        'invoices' => '/invoices',
    ],
];
