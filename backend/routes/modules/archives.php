<?php

use App\Http\Controllers\API\ArchiveController;
use Illuminate\Support\Facades\Route;

// Module Archives
Route::prefix('archives')->name('archives.')->group(function () {
    Route::get('/', [ArchiveController::class, 'index'])->name('index');
    Route::post('/', [ArchiveController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/search', [ArchiveController::class, 'search'])->name('search');
    Route::get('/export', [ArchiveController::class, 'export'])->name('export');
    Route::post('/restore/{id}', [ArchiveController::class, 'restore'])->middleware('role:admin')->name('restore');
    
    Route::prefix('{archive}')->group(function () {
        Route::get('/', [ArchiveController::class, 'show'])->name('show');
        Route::delete('/', [ArchiveController::class, 'destroy'])->middleware('role:admin')->name('destroy');
    });
});