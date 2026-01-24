<?php

use App\Http\Controllers\API\ConteneurTraiteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Application Facturation
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => 'facturation',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Endpoint pour recevoir les conteneurs traités depuis l'app OPS
// Protégé par X-API-Key header
Route::post('/conteneurs-traites', [ConteneurTraiteController::class, 'store'])
    ->name('conteneurs-traites.store');

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    
    // Gestion des conteneurs traités reçus
    Route::get('/conteneurs-traites', [ConteneurTraiteController::class, 'index'])
        ->name('conteneurs-traites.index');
    
    Route::get('/conteneurs-traites/{id}', [ConteneurTraiteController::class, 'show'])
        ->name('conteneurs-traites.show');
    
    Route::post('/conteneurs-traites/{id}/facturer', [ConteneurTraiteController::class, 'facturer'])
        ->name('conteneurs-traites.facturer');
    
    // Autres routes de facturation existantes...
    // require __DIR__.'/modules/factures.php';
    // require __DIR__.'/modules/clients.php';
    // etc.
});
