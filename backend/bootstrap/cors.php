<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://b3b36859-40bc-4d2e-9dda-fa8b3af543d8.lovableproject.com',
        'https://id-preview--b3b36859-40bc-4d2e-9dda-fa8b3af543d8.lovable.app',
        'https://lovable.app',
        'https://*.lovableproject.com',
        'https://*.lovable.app',
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.lovableproject\.com$/',
        '/^https:\/\/.*\.lovable\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];