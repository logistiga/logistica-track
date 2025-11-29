<?php

use App\Http\Controllers\API\OperationController;
use Illuminate\Support\Facades\Route;

// Module Opérations
Route::prefix('operations')->name('operations.')->group(function () {
    Route::get('/', [OperationController::class, 'index'])->name('index');
    Route::post('/', [OperationController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/planifiees', [OperationController::class, 'planifiees'])->name('planifiees');
    Route::get('/en-cours', [OperationController::class, 'enCours'])->name('en-cours');
    Route::get('/terminees', [OperationController::class, 'terminees'])->name('terminees');
    Route::get('/calendar', [OperationController::class, 'calendar'])->name('calendar');
    Route::get('/search', [OperationController::class, 'search'])->name('search');
    Route::get('/export', [OperationController::class, 'export'])->name('export');
    
    // Archive routes - must come before {operation} catch-all
    Route::get('/archives', [OperationController::class, 'archives'])->name('archives');
    Route::get('/archives/search', [OperationController::class, 'archivesSearch'])->name('archives.search');
    Route::get('/archives/stats', [OperationController::class, 'archivesStats'])->name('archives.stats');
    
    Route::prefix('{operation}')->group(function () {
        Route::get('/', [OperationController::class, 'show'])->name('show');
        Route::put('/', [OperationController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::put('/statut', [OperationController::class, 'updateStatut'])->middleware('role:admin,manager,operator')->name('update-statut');
        Route::delete('/', [OperationController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/start', [OperationController::class, 'start'])->middleware('role:admin,manager,operator')->name('start');
        Route::post('/complete', [OperationController::class, 'complete'])->middleware('role:admin,manager,operator')->name('complete');
        Route::post('/cancel', [OperationController::class, 'cancel'])->middleware('role:admin,manager')->name('cancel');
        Route::get('/documents', [OperationController::class, 'documents'])->name('documents');
    });
});