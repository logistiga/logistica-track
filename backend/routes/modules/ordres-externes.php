<?php

use App\Http\Controllers\API\OrdreTravailExterneController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes Ordres de Travail Externes
|--------------------------------------------------------------------------
|
| Routes pour la gestion des ordres de travail reçus de l'application externe
| Ces routes sont accessibles via l'authentification Sanctum
|
*/

Route::prefix('ordres-externes')->name('ordres-externes.')->group(function () {
    
    // Liste et stats
    Route::get('/', [OrdreTravailExterneController::class, 'index'])->name('index');
    Route::get('/stats', [OrdreTravailExterneController::class, 'stats'])->name('stats');
    
    // CRUD
    Route::post('/', [OrdreTravailExterneController::class, 'store'])->name('store');
    Route::get('/{id}', [OrdreTravailExterneController::class, 'show'])->name('show');
    Route::put('/{id}', [OrdreTravailExterneController::class, 'update'])->name('update');
    Route::delete('/{id}', [OrdreTravailExterneController::class, 'destroy'])->name('destroy');
    
    // Actions
    Route::put('/{id}/status', [OrdreTravailExterneController::class, 'updateStatus'])->name('status');
});
