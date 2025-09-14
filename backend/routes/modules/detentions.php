<?php

use App\Http\Controllers\API\DetentionController;
use Illuminate\Support\Facades\Route;

// Module Détentions
Route::prefix('detentions')->name('detentions.')->group(function () {
    Route::get('/', [DetentionController::class, 'index'])->name('index');
    Route::post('/', [DetentionController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/stats', [DetentionController::class, 'stats'])->name('stats');
    
    Route::prefix('{detention}')->group(function () {
        Route::put('/', [DetentionController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::post('/resolve', [DetentionController::class, 'resolve'])->middleware('role:admin,manager,operator')->name('resolve');
    });
    
    // Route pour créer les détentions manquantes
    Route::post('/fix-missing', [DetentionController::class, 'createMissingDetentions'])->middleware('role:admin,manager,operator')->name('fix-missing');
});