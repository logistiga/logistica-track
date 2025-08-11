<?php

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\SystemController;
use App\Http\Controllers\API\AuditController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes pour l'administration du système
| Nécessite le rôle admin ou manager
|
*/

Route::middleware(['auth:sanctum', 'role:admin,manager'])->prefix('admin')->group(function () {
    
    // Gestion des utilisateurs
    Route::prefix('users')->name('admin.users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        Route::post('/{user}/activate', [UserController::class, 'activate'])->name('activate');
        Route::post('/{user}/deactivate', [UserController::class, 'deactivate'])->name('deactivate');
        Route::post('/{user}/reset-password', [UserController::class, 'resetPassword'])->name('reset-password');
    });

    // Gestion des rôles et permissions
    Route::prefix('roles')->name('admin.roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{role}', [RoleController::class, 'show'])->name('show');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
        Route::get('/{role}/permissions', [RoleController::class, 'permissions'])->name('permissions');
        Route::post('/{role}/permissions', [RoleController::class, 'syncPermissions'])->name('sync-permissions');
    });

    // Administration système (réservé admin uniquement)
    Route::middleware('role:admin')->prefix('system')->name('admin.system.')->group(function () {
        Route::get('/info', [SystemController::class, 'info'])->name('info');
        Route::get('/logs', [SystemController::class, 'logs'])->name('logs');
        Route::post('/clear-cache', [SystemController::class, 'clearCache'])->name('clear-cache');
        Route::post('/maintenance', [SystemController::class, 'maintenanceMode'])->name('maintenance');
        Route::get('/database/backup', [SystemController::class, 'databaseBackup'])->name('database.backup');
        Route::post('/database/restore', [SystemController::class, 'databaseRestore'])->name('database.restore');
    });

    // Audit et historique
    Route::prefix('audit')->name('admin.audit.')->group(function () {
        Route::get('/logs', [AuditController::class, 'logs'])->name('logs');
        Route::get('/activity', [AuditController::class, 'activity'])->name('activity');
        Route::get('/reports', [AuditController::class, 'reports'])->name('reports');
        Route::get('/export', [AuditController::class, 'export'])->name('export');
    });
});