<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | App Facturation (facturation.logistiga.com)
    |--------------------------------------------------------------------------
    |
    | Configuration pour la synchronisation bidirectionnelle avec l'app
    | de facturation Logistiga
    |
    */
    'facturation' => [
        // URL de base de l'API de facturation
        'url' => env('FACTURATION_API_URL', 'https://facturation.logistiga.com'),
        
        // API Key pour envoyer vers facturation
        'api_key' => env('FACTURATION_API_KEY'),
        
        // API Key attendue pour les webhooks entrants
        'webhook_key' => env('FACTURATION_WEBHOOK_KEY'),
        
        // Timeout en secondes
        'timeout' => env('FACTURATION_API_TIMEOUT', 30),
    ],

];
