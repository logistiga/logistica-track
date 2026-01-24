<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
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

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Logistiga OPS Integration
    |--------------------------------------------------------------------------
    | Configuration pour recevoir les données de l'app OPS (Logistiga)
    */

    'logistiga' => [
        // Clé API pour valider les requêtes entrantes depuis l'app OPS
        'api_key' => env('LOGISTIGA_API_KEY'),
        
        // URL de l'app OPS (pour callbacks si nécessaire)
        'ops_url' => env('LOGISTIGA_OPS_URL', 'https://logistiga.com'),
    ],

];
