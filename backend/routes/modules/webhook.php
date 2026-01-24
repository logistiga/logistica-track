<?php

use App\Http\Controllers\API\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes Webhook (publiques, protégées par API Key)
|--------------------------------------------------------------------------
|
| Ces routes sont accessibles sans authentification Sanctum
| Elles sont protégées par une API Key dans le header X-API-Key
|
*/

Route::prefix('webhook')->name('webhook.')->group(function () {
    
    // Health check
    Route::get('/health', [WebhookController::class, 'health'])->name('health');
    
    // Réception des ordres depuis l'app de facturation
    Route::post('/ordres-externes', [WebhookController::class, 'receiveOrdreTravail'])->name('ordres-externes');
    
});
