<?php

use App\Http\Controllers\API\ExternalLogistiqueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API Externe Logistique
|--------------------------------------------------------------------------
|
| Routes pour l'intégration avec l'API externe de gestion logistique
| (ordres de travail, clients, factures)
|
*/

Route::prefix('external-logistique')->name('external-logistique.')->group(function () {
    
    // Health check & Stats
    Route::get('/health', [ExternalLogistiqueController::class, 'health'])->name('health');
    Route::get('/stats', [ExternalLogistiqueController::class, 'stats'])->name('stats');
    
    // Clients
    Route::prefix('clients')->name('clients.')->group(function () {
        Route::get('/', [ExternalLogistiqueController::class, 'getClients'])->name('index');
        Route::get('/{id}', [ExternalLogistiqueController::class, 'getClient'])->name('show');
        Route::post('/', [ExternalLogistiqueController::class, 'createClient'])->name('store');
        Route::put('/{id}', [ExternalLogistiqueController::class, 'updateClient'])->name('update');
    });
    
    // Ordres de Travail
    Route::prefix('ordres-travail')->name('ordres-travail.')->group(function () {
        Route::get('/', [ExternalLogistiqueController::class, 'getOrdresTravail'])->name('index');
        Route::get('/{id}', [ExternalLogistiqueController::class, 'getOrdreTravail'])->name('show');
        Route::post('/', [ExternalLogistiqueController::class, 'createOrdreTravail'])->name('store');
        Route::put('/{id}', [ExternalLogistiqueController::class, 'updateOrdreTravail'])->name('update');
        Route::put('/{id}/status', [ExternalLogistiqueController::class, 'updateOrdreTravailStatus'])->name('status');
    });
    
    // Factures
    Route::prefix('invoices')->name('invoices.')->group(function () {
        Route::get('/', [ExternalLogistiqueController::class, 'getInvoices'])->name('index');
        Route::get('/{id}', [ExternalLogistiqueController::class, 'getInvoice'])->name('show');
    });
    
    // Conteneurs
    Route::prefix('containers')->name('containers.')->group(function () {
        Route::post('/', [ExternalLogistiqueController::class, 'sendContainers'])->name('send');
        Route::post('/batch', [ExternalLogistiqueController::class, 'sendContainersBatch'])->name('batch');
    });
});
