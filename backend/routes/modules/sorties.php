<?php

use App\Http\Controllers\API\SortieConteneurController;
use App\Http\Controllers\API\SortieRetourController;
use Illuminate\Support\Facades\Route;

// Module Sorties de Conteneurs
Route::prefix('sorties')->name('sorties.')->group(function () {
    Route::get('/', [SortieConteneurController::class, 'index'])->name('index');
    Route::post('/', [SortieConteneurController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/en-cours', [SortieConteneurController::class, 'enCours'])->name('en-cours');
    Route::get('/retournees', [SortieConteneurController::class, 'retournees'])->name('retournees');
    Route::get('/search', [SortieConteneurController::class, 'search'])->name('search');
    Route::get('/stats', [SortieConteneurController::class, 'stats'])->name('stats');
    Route::get('/export', [SortieConteneurController::class, 'export'])->name('export');
    Route::get('/archives', [SortieConteneurController::class, 'archives'])->name('archives');
    Route::get('/archives/search', [SortieConteneurController::class, 'archivesSearch'])->name('archives.search');
    Route::get('/archives/stats', [SortieConteneurController::class, 'archivesStats'])->name('archives.stats');
    Route::post('/bulk-return', [SortieRetourController::class, 'bulkReturn'])->middleware('role:admin,manager,operator')->name('bulk-return');
    
    Route::prefix('{sortie}')->group(function () {
        Route::get('/', [SortieConteneurController::class, 'show'])->name('show');
        Route::put('/', [SortieConteneurController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
        Route::delete('/', [SortieConteneurController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/archiver', [SortieConteneurController::class, 'archiver'])->middleware('role:admin,manager,operator')->name('archiver');
        Route::post('/return', [SortieRetourController::class, 'return'])->middleware('role:admin,manager,operator')->name('return');
        Route::get('/detention', [SortieConteneurController::class, 'detention'])->name('detention');
        Route::get('/facture', [SortieConteneurController::class, 'facture'])->name('facture');
        Route::get('/timeline', [SortieConteneurController::class, 'timeline'])->name('timeline');
    });
});