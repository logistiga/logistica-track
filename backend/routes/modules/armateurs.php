<?php

use App\Http\Controllers\API\ArmateurController;
use Illuminate\Support\Facades\Route;

// Module Armateurs
Route::prefix('armateurs')->name('armateurs.')->group(function () {
    Route::get('/', [ArmateurController::class, 'index'])->name('index');
    Route::post('/', [ArmateurController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/actifs', [ArmateurController::class, 'actifs'])->name('actifs');
    Route::get('/search', [ArmateurController::class, 'search'])->name('search');
    Route::get('/export', [ArmateurController::class, 'export'])->name('export');
    
    Route::prefix('{armateur}')->group(function () {
        Route::get('/', [ArmateurController::class, 'show'])->name('show');
        Route::put('/', [ArmateurController::class, 'update'])->middleware('role:admin,manager')->name('update');
        Route::delete('/', [ArmateurController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/activate', [ArmateurController::class, 'activate'])->middleware('role:admin,manager')->name('activate');
        Route::post('/deactivate', [ArmateurController::class, 'deactivate'])->middleware('role:admin,manager')->name('deactivate');
        Route::get('/sorties', [ArmateurController::class, 'sorties'])->name('sorties');
        Route::get('/stats', [ArmateurController::class, 'stats'])->name('stats');
    });
});