<?php

/*
|--------------------------------------------------------------------------
| Application Performance Optimization
|--------------------------------------------------------------------------
|
| This file contains the configuration for optimizing the performance
| of your Laravel application. These settings will be used when your
| application is running in production mode.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Compiled Views Path
    |--------------------------------------------------------------------------
    |
    | This option determines where all the compiled Blade templates will be
    | stored for your application. Typically, this is within the storage
    | directory. However, as usual, you are free to change this value.
    |
    */

    'compiled' => env(
        'VIEW_COMPILED_PATH',
        realpath(storage_path('framework/views'))
    ),

    /*
    |--------------------------------------------------------------------------
    | Routes Cache
    |--------------------------------------------------------------------------
    |
    | Here you can configure if routes should be cached in production mode.
    | Setting this to true will improve performance significantly but
    | remember to clear the cache when deploying new changes.
    |
    */

    'routes_cache' => env('ROUTES_CACHE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Config Cache
    |--------------------------------------------------------------------------
    |
    | When this option is enabled, all configuration files will be combined
    | into a single cached file which can be loaded quickly on every request.
    | This can dramatically speed up your application in production.
    |
    */

    'config_cache' => env('CONFIG_CACHE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Events Cache
    |--------------------------------------------------------------------------
    |
    | This option allows you to cache all of your application's events and
    | their listeners which can speed up the boot time of your application
    | on each request. This should be enabled in production.
    |
    */

    'events_cache' => env('EVENTS_CACHE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | View Cache
    |--------------------------------------------------------------------------
    |
    | This option determines if compiled views should be cached. In production
    | this should always be enabled to improve performance. Views will be
    | recompiled only when the source template changes.
    |
    */

    'views_cache' => env('VIEWS_CACHE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Eager Loading Optimization
    |--------------------------------------------------------------------------
    |
    | This configuration helps optimize database queries by setting default
    | eager loading patterns for frequently accessed relationships.
    |
    */

    'eager_loading' => [
        'sortie_conteneurs' => ['armateur', 'camion', 'remorque'],
        'operations' => ['responsable', 'sortieConteneur'],
        'detentions' => ['sortieConteneur'],
        'facturations' => ['sortieConteneur'],
        'notifications' => ['user'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Query Optimization
    |--------------------------------------------------------------------------
    |
    | Settings for optimizing database queries in production environment.
    |
    */

    'query_optimization' => [
        'select_optimization' => true,
        'index_hints' => true,
        'query_caching' => env('QUERY_CACHE_ENABLED', true),
        'slow_query_log' => env('SLOW_QUERY_LOG', false),
    ],

];