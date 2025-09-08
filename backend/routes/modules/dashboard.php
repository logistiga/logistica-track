<?php

use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\StatistiqueController;
use Illuminate\Support\Facades\Route;

// Dashboard et statistiques
Route::prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    Route::get('/stats', [DashboardController::class, 'stats'])->name('stats');
    Route::get('/recent-activity', [DashboardController::class, 'recentActivity'])->name('recent-activity');
    Route::get('/alerts', [DashboardController::class, 'alerts'])->name('alerts');
});

// Statistiques générales
Route::prefix('stats')->name('stats.')->group(function () {
    Route::get('/overview', [StatistiqueController::class, 'overview'])->name('overview');
    Route::get('/monthly/{year?}/{month?}', [StatistiqueController::class, 'monthly'])->name('monthly');
    Route::get('/yearly/{year?}', [StatistiqueController::class, 'yearly'])->name('yearly');
    Route::get('/performance', [StatistiqueController::class, 'performance'])->name('performance');
    Route::get('/trends', [StatistiqueController::class, 'trends'])->name('trends');
});