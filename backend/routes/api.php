<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SortieConteneurController;
use App\Http\Controllers\API\ArmateurController;
use App\Http\Controllers\API\VehiculeController;
use App\Http\Controllers\API\OperationController;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes d'authentification (publiques)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// Routes API protégées
Route::middleware('auth:sanctum')->group(function () {
    
    // Sorties de conteneurs
    Route::apiResource('sorties-conteneurs', SortieConteneurController::class);
    Route::prefix('sorties-conteneurs')->group(function () {
        Route::post('{id}/retour', [SortieConteneurController::class, 'confirmerRetour']);
        Route::get('export', [SortieConteneurController::class, 'export']);
        Route::get('stats', [SortieConteneurController::class, 'statistiques']);
    });
    
    // Armateurs
    Route::apiResource('armateurs', ArmateurController::class);
    
    // Véhicules
    Route::apiResource('vehicules', VehiculeController::class);
    Route::prefix('vehicules')->group(function () {
        Route::get('camions', [VehiculeController::class, 'camions']);
        Route::get('remorques', [VehiculeController::class, 'remorques']);
        Route::get('disponibles', [VehiculeController::class, 'disponibles']);
    });
    
    // Opérations
    Route::apiResource('operations', OperationController::class);
    
    // Utilisateurs (admin seulement)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });
    
    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
    });
    
});