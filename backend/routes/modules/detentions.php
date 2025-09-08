<?php

use App\Http\Controllers\API\DetentionController;
use Illuminate\Support\Facades\Route;

// Module Détentions
Route::prefix('detentions')->name('detentions.')->group(function () {
    Route::get('/', [DetentionController::class, 'index'])->name('index');
    Route::post('/', [DetentionController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/actives', [DetentionController::class, 'actives'])->name('actives');
    Route::get('/resolues', [DetentionController::class, 'resolues'])->name('resolues');
    Route::get('/stats', [DetentionController::class, 'stats'])->name('stats');
    Route::get('/export', [DetentionController::class, 'export'])->name('export');
    
    Route::prefix('{detention}')->group(function () {
        Route::get('/', [DetentionController::class, 'show'])->name('show');
        Route::put('/', [DetentionController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [DetentionController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/resolve', [DetentionController::class, 'resolve'])->middleware('role:admin,manager,operator')->name('resolve');
        Route::post('/contest', [DetentionController::class, 'contest'])->middleware('role:admin,manager,operator')->name('contest');
    });
});