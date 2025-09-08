<?php

use App\Http\Controllers\API\EmailController;
use Illuminate\Support\Facades\Route;

// Module Emails
Route::prefix('emails')->name('emails.')->group(function () {
    Route::get('/', [EmailController::class, 'index'])->name('index');
    Route::post('/', [EmailController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
    Route::get('/en-attente', [EmailController::class, 'enAttente'])->name('en-attente');
    Route::get('/envoyes', [EmailController::class, 'envoyes'])->name('envoyes');
    Route::get('/echecs', [EmailController::class, 'echecs'])->name('echecs');
    Route::get('/stats', [EmailController::class, 'stats'])->name('stats');
    Route::post('/resend-failed', [EmailController::class, 'resendFailed'])->middleware('role:admin,manager')->name('resend-failed');
    
    Route::prefix('{email}')->group(function () {
        Route::get('/', [EmailController::class, 'show'])->name('show');
        Route::delete('/', [EmailController::class, 'destroy'])->middleware('role:admin')->name('destroy');
        Route::post('/resend', [EmailController::class, 'resend'])->middleware('role:admin,manager')->name('resend');
    });
});