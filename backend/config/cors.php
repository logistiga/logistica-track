<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_merge(
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000')),
        [
            'https://suivitc.logistiga.com',
            'https://facturation.logistiga.com',
            'https://logistiga.com',
        ]
    ),

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.lovableproject\.com$/',
        '/^https:\/\/.*\.lovable\.app$/',
        '/^https:\/\/.*--.*\.lovable\.app$/',
        '/^https:\/\/.*\.logistiga\.com$/',
        '/^https:\/\/.*\.ngrok-free\.dev$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => env('CORS_MAX_AGE', 0),

    'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', true),

];