<?php

use App\Http\Controllers\API\ArmateurController;
use App\Http\Controllers\API\VehiculeStatusController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes API organisées par modules pour l'application de gestion logistique
| Toutes les routes sont préfixées par /api et utilisent le middleware auth:sanctum
|
*/

// Import des routes d'authentification
require __DIR__.'/auth.php';

// Import des routes d'administration
require __DIR__.'/admin.php';

// Routes publiques (sans authentification)
Route::prefix('public')->group(function () {
    Route::get('/armateurs/actifs', [ArmateurController::class, 'actifsPublic'])->name('public.armateurs.actifs');
    Route::get('/vehicules/disponibles', [VehiculeStatusController::class, 'disponiblesPublic'])->name('public.vehicules.disponibles');
});

// System routes (health check & CORS test)
Route::get('/health', [\App\Http\Controllers\API\SystemController::class, 'health'])->name('system.health');
Route::get('/cors-test', [\App\Http\Controllers\API\SystemController::class, 'corsTest'])->name('system.cors-test');

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    
    // Import des modules
    require __DIR__.'/modules/dashboard.php';
    require __DIR__.'/modules/armateurs.php';
    require __DIR__.'/modules/vehicules.php';
    require __DIR__.'/modules/sorties.php';
    require __DIR__.'/modules/operations.php';
    require __DIR__.'/modules/detentions.php';
    require __DIR__.'/modules/facturations.php';
    require __DIR__.'/modules/emails.php';
    require __DIR__.'/modules/notifications.php';
    require __DIR__.'/modules/archives.php';
    require __DIR__.'/modules/base.php';
    require __DIR__.'/modules/primes.php';
    require __DIR__.'/modules/external-logistique.php';
});

// Routes de fallback pour API non trouvée
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint API non trouvé',
        'error' => 'Route not found'
    ], 404);
});