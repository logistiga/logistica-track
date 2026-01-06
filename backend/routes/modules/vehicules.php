<?php

use App\Http\Controllers\API\VehiculeController;
use App\Http\Controllers\API\VehiculeSearchController;
use App\Http\Controllers\API\VehiculeReportController;
use Illuminate\Support\Facades\Route;

// Module Véhicules
Route::prefix('vehicules')->name('vehicules.')->group(function () {
    Route::get('/', [VehiculeController::class, 'index'])->name('index');
    Route::post('/', [VehiculeController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/camions', [VehiculeSearchController::class, 'camions'])->name('camions');
    Route::get('/remorques', [VehiculeSearchController::class, 'remorques'])->name('remorques');
    Route::get('/search', [VehiculeSearchController::class, 'search'])->name('search');
    Route::get('/export', [VehiculeReportController::class, 'export'])->name('export');
    
    Route::prefix('{vehicule}')->group(function () {
        Route::get('/', [VehiculeController::class, 'show'])->name('show');
        Route::put('/', [VehiculeController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [VehiculeController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::get('/history', [VehiculeReportController::class, 'history'])->name('history');
    });
});