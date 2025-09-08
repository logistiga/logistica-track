<?php

use App\Http\Controllers\API\FacturationController;
use Illuminate\Support\Facades\Route;

// Module Facturation
Route::prefix('facturations')->name('facturations.')->group(function () {
    Route::get('/', [FacturationController::class, 'index'])->name('index');
    Route::post('/', [FacturationController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/brouillons', [FacturationController::class, 'brouillons'])->name('brouillons');
    Route::get('/envoyees', [FacturationController::class, 'envoyees'])->name('envoyees');
    Route::get('/payees', [FacturationController::class, 'payees'])->name('payees');
    Route::get('/stats', [FacturationController::class, 'stats'])->name('stats');
    Route::get('/export', [FacturationController::class, 'export'])->name('export');
    
    Route::prefix('{facturation}')->group(function () {
        Route::get('/', [FacturationController::class, 'show'])->name('show');
        Route::put('/', [FacturationController::class, 'update'])->middleware('role:admin,manager')->name('update');
        Route::delete('/', [FacturationController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/send', [FacturationController::class, 'send'])->middleware('role:admin,manager')->name('send');
        Route::post('/pay', [FacturationController::class, 'markAsPaid'])->middleware('role:admin,manager')->name('pay');
        Route::get('/pdf', [FacturationController::class, 'pdf'])->name('pdf');
    });
});