<?php

use App\Http\Controllers\API\PrimeController;
use Illuminate\Support\Facades\Route;

// Module Primes Chauffeur
Route::prefix('primes')->name('primes.')->group(function () {
    Route::get('/', [PrimeController::class, 'index'])->name('index');
    Route::get('/stats', [PrimeController::class, 'stats'])->name('stats');
    Route::put('/{id}', [PrimeController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
    Route::post('/{id}/marquer-paye', [PrimeController::class, 'marquerCommePaye'])->middleware('role:admin,manager')->name('marquer-paye');
});
