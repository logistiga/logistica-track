<?php

use App\Http\Controllers\API\VehiculeController;
use App\Http\Controllers\API\VehiculeStatusController;
use App\Http\Controllers\API\VehiculeSearchController;
use App\Http\Controllers\API\VehiculeReportController;
use Illuminate\Support\Facades\Route;

// Module Véhicules
Route::prefix('vehicules')->name('vehicules.')->group(function () {
    Route::get('/', [VehiculeController::class, 'index'])->name('index');
    Route::post('/', [VehiculeController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/disponibles', [VehiculeStatusController::class, 'disponibles'])->name('disponibles');
    Route::get('/camions', [VehiculeSearchController::class, 'camions'])->name('camions');
    Route::get('/remorques', [VehiculeSearchController::class, 'remorques'])->name('remorques');
    Route::get('/en-mission', [VehiculeStatusController::class, 'enMission'])->name('en-mission');
    Route::get('/maintenance', [VehiculeStatusController::class, 'maintenance'])->name('maintenance');
    Route::get('/search', [VehiculeSearchController::class, 'search'])->name('search');
    Route::get('/export', [VehiculeReportController::class, 'export'])->name('export');
    Route::post('/reset-statuts', [VehiculeStatusController::class, 'resetAllStatuts'])->middleware('role:admin')->name('reset-statuts');
    
    Route::prefix('{vehicule}')->group(function () {
        Route::get('/', [VehiculeController::class, 'show'])->name('show');
        Route::put('/', [VehiculeController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [VehiculeController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/assign', [VehiculeStatusController::class, 'assign'])->middleware('role:admin,manager,operator')->name('assign');
        Route::post('/release', [VehiculeStatusController::class, 'release'])->middleware('role:admin,manager,operator')->name('release');
        Route::put('/statut', [VehiculeStatusController::class, 'updateStatut'])->middleware('role:admin,manager')->name('update-statut');
        Route::get('/history', [VehiculeReportController::class, 'history'])->name('history');
        Route::get('/maintenance-schedule', [VehiculeReportController::class, 'maintenanceSchedule'])->name('maintenance-schedule');
    });
});