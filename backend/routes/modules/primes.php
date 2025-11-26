<?php

use App\Http\Controllers\API\PrimeController;
use Illuminate\Support\Facades\Route;

// Module Primes Chauffeur
Route::prefix('primes')->name('primes.')->group(function () {
    Route::get('/', [PrimeController::class, 'index'])->name('index');
    Route::get('/stats', [PrimeController::class, 'stats'])->name('stats');
    Route::get('/archives', [PrimeController::class, 'archives'])->name('archives');
    Route::get('/archives/stats', [PrimeController::class, 'archiveStats'])->name('archives.stats');
    Route::put('/{id}', [PrimeController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
    Route::post('/payer-en-lot', [PrimeController::class, 'payerEnLot'])->middleware('role:admin,manager')->name('payer-en-lot');
});
