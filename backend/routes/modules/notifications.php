<?php

use App\Http\Controllers\API\NotificationController;
use Illuminate\Support\Facades\Route;

// Module Notifications
Route::prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::post('/', [NotificationController::class, 'store'])->middleware('role:admin,manager')->name('store');
    Route::get('/unread', [NotificationController::class, 'unread'])->name('unread');
    Route::get('/read', [NotificationController::class, 'read'])->name('read');
    Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
    Route::delete('/clear-read', [NotificationController::class, 'clearRead'])->name('clear-read');
    
    Route::prefix('{notification}')->group(function () {
        Route::get('/', [NotificationController::class, 'show'])->name('show');
        Route::post('/mark-read', [NotificationController::class, 'markAsRead'])->name('mark-read');
        Route::delete('/', [NotificationController::class, 'destroy'])->name('destroy');
    });
});