<?php

use App\Http\Controllers\API\StockageController;
use App\Http\Controllers\API\DoubleRelevageController;
use App\Http\Controllers\API\DepotageController;
use Illuminate\Support\Facades\Route;

// Module Stockage
Route::prefix('stockages')->name('stockages.')->group(function () {
    Route::get('/', [StockageController::class, 'index'])->name('index');
    Route::post('/', [StockageController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/actifs', [StockageController::class, 'actifs'])->name('actifs');
    Route::get('/stats', [StockageController::class, 'stats'])->name('stats');
    
    Route::prefix('{stockage}')->group(function () {
        Route::get('/', [StockageController::class, 'show'])->name('show');
        Route::put('/', [StockageController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [StockageController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/sortie', [StockageController::class, 'sortie'])->middleware('role:admin,manager,operator')->name('sortie');
        Route::post('/archiver', [StockageController::class, 'archiver'])->middleware('role:admin,manager')->name('archiver');
    });
});

// Module Double Relevage
Route::prefix('double-relevages')->name('double-relevages.')->group(function () {
    Route::get('/', [DoubleRelevageController::class, 'index'])->name('index');
    Route::post('/', [DoubleRelevageController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/en-attente', [DoubleRelevageController::class, 'enAttente'])->name('en-attente');
    Route::get('/stats', [DoubleRelevageController::class, 'stats'])->name('stats');
    
    Route::prefix('{doubleRelevage}')->group(function () {
        Route::get('/', [DoubleRelevageController::class, 'show'])->name('show');
        Route::put('/', [DoubleRelevageController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [DoubleRelevageController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/confirmer', [DoubleRelevageController::class, 'confirmer'])->middleware('role:admin,manager,operator')->name('confirmer');
        Route::post('/archiver', [DoubleRelevageController::class, 'archiver'])->middleware('role:admin,manager')->name('archiver');
    });
});

// Module Dépotage
Route::prefix('depotages')->name('depotages.')->group(function () {
    Route::get('/', [DepotageController::class, 'index'])->name('index');
    Route::post('/', [DepotageController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/en-cours', [DepotageController::class, 'enCours'])->name('en-cours');
    Route::get('/stats', [DepotageController::class, 'stats'])->name('stats');
    
    Route::prefix('{depotage}')->group(function () {
        Route::get('/', [DepotageController::class, 'show'])->name('show');
        Route::put('/', [DepotageController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [DepotageController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/terminer', [DepotageController::class, 'terminer'])->middleware('role:admin,manager,operator')->name('terminer');
    });
});