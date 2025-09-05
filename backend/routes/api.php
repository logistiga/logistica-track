<?php

use App\Http\Controllers\API\ArmateurController;
use App\Http\Controllers\API\SortieConteneurController;
use App\Http\Controllers\API\VehiculeController;
use App\Http\Controllers\API\VehiculeStatusController;
use App\Http\Controllers\API\VehiculeSearchController;
use App\Http\Controllers\API\VehiculeReportController;
use App\Http\Controllers\API\OperationController;
use App\Http\Controllers\API\DetentionController;
use App\Http\Controllers\API\FacturationController;
use App\Http\Controllers\API\EmailController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\ArchiveController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\StatistiqueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes API organisées par modules pour l'application de gestion logistique
| Toutes les routes sont préfixées par /api et utilisent le middleware auth:sanctum
|
*/

// Import des routes d'authentification
require __DIR__.'/auth.php';

// Import des routes d'administration
require __DIR__.'/admin.php';

// Routes publiques (sans authentification)
Route::prefix('public')->group(function () {
    Route::get('/armateurs/actifs', [ArmateurController::class, 'actifsPublic'])->name('public.armateurs.actifs');
    Route::get('/vehicules/disponibles', [VehiculeStatusController::class, 'disponiblesPublic'])->name('public.vehicules.disponibles');
});

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    
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

    // Module Armateurs
    Route::prefix('armateurs')->name('armateurs.')->group(function () {
        Route::get('/', [ArmateurController::class, 'index'])->name('index');
        Route::post('/', [ArmateurController::class, 'store'])->middleware('role:admin,manager')->name('store');
        Route::get('/actifs', [ArmateurController::class, 'actifs'])->name('actifs');
        Route::get('/search', [ArmateurController::class, 'search'])->name('search');
        Route::get('/export', [ArmateurController::class, 'export'])->name('export');
        
        Route::prefix('{armateur}')->group(function () {
            Route::get('/', [ArmateurController::class, 'show'])->name('show');
            Route::put('/', [ArmateurController::class, 'update'])->middleware('role:admin,manager')->name('update');
            Route::delete('/', [ArmateurController::class, 'destroy'])->middleware('role:admin')->name('destroy');
            Route::post('/activate', [ArmateurController::class, 'activate'])->middleware('role:admin,manager')->name('activate');
            Route::post('/deactivate', [ArmateurController::class, 'deactivate'])->middleware('role:admin,manager')->name('deactivate');
            Route::get('/sorties', [ArmateurController::class, 'sorties'])->name('sorties');
            Route::get('/stats', [ArmateurController::class, 'stats'])->name('stats');
        });
    });

    // Module Véhicules
    Route::prefix('vehicules')->name('vehicules.')->group(function () {
        Route::get('/', [VehiculeController::class, 'index'])->name('index');
        Route::post('/', [VehiculeController::class, 'store'])->middleware('role:admin,manager')->name('store');
        Route::get('/disponibles', [VehiculeStatusController::class, 'disponibles'])->name('disponibles');
        Route::get('/camions', [VehiculeSearchController::class, 'camions'])->name('camions');
        Route::get('/remorques', [VehiculeSearchController::class, 'remorques'])->name('remorques');
        Route::get('/en-mission', [VehiculeStatusController::class, 'enMission'])->name('en-mission');
        Route::get('/maintenance', [VehiculeStatusController::class, 'maintenance'])->name('maintenance');
        Route::get('/search', [VehiculeSearchController::class, 'search'])->name('search');
        Route::get('/export', [VehiculeReportController::class, 'export'])->name('export');
        
        Route::prefix('{vehicule}')->group(function () {
            Route::get('/', [VehiculeController::class, 'show'])->name('show');
            Route::put('/', [VehiculeController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
            Route::delete('/', [VehiculeController::class, 'destroy'])->middleware('role:admin')->name('destroy');
            Route::post('/assign', [VehiculeStatusController::class, 'assign'])->middleware('role:admin,manager,operator')->name('assign');
            Route::post('/release', [VehiculeStatusController::class, 'release'])->middleware('role:admin,manager,operator')->name('release');
            Route::get('/history', [VehiculeReportController::class, 'history'])->name('history');
            Route::get('/maintenance-schedule', [VehiculeReportController::class, 'maintenanceSchedule'])->name('maintenance-schedule');
        });
    });

    // Module Sorties de Conteneurs
    Route::prefix('sorties')->name('sorties.')->group(function () {
        Route::get('/', [SortieConteneurController::class, 'index'])->name('index');
        Route::post('/', [SortieConteneurController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
        Route::get('/en-cours', [SortieConteneurController::class, 'enCours'])->name('en-cours');
        Route::get('/retournees', [SortieConteneurController::class, 'retournees'])->name('retournees');
        Route::get('/search', [SortieConteneurController::class, 'search'])->name('search');
        Route::get('/stats', [SortieConteneurController::class, 'stats'])->name('stats');
        Route::get('/export', [SortieConteneurController::class, 'export'])->name('export');
        Route::post('/bulk-return', [SortieConteneurController::class, 'bulkReturn'])->middleware('role:admin,manager,operator')->name('bulk-return');
        
        Route::prefix('{sortie}')->group(function () {
            Route::get('/', [SortieConteneurController::class, 'show'])->name('show');
            Route::put('/', [SortieConteneurController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
            Route::delete('/', [SortieConteneurController::class, 'destroy'])->middleware('role:admin')->name('destroy');
            Route::post('/return', [SortieConteneurController::class, 'return'])->middleware('role:admin,manager,operator')->name('return');
            Route::get('/detention', [SortieConteneurController::class, 'detention'])->name('detention');
            Route::get('/facture', [SortieConteneurController::class, 'facture'])->name('facture');
            Route::get('/timeline', [SortieConteneurController::class, 'timeline'])->name('timeline');
        });
    });

    // Module Opérations
    Route::prefix('operations')->name('operations.')->group(function () {
        Route::get('/', [OperationController::class, 'index'])->name('index');
        Route::post('/', [OperationController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
        Route::get('/planifiees', [OperationController::class, 'planifiees'])->name('planifiees');
        Route::get('/en-cours', [OperationController::class, 'enCours'])->name('en-cours');
        Route::get('/terminees', [OperationController::class, 'terminees'])->name('terminees');
        Route::get('/calendar', [OperationController::class, 'calendar'])->name('calendar');
        Route::get('/search', [OperationController::class, 'search'])->name('search');
        Route::get('/export', [OperationController::class, 'export'])->name('export');
        
        Route::prefix('{operation}')->group(function () {
            Route::get('/', [OperationController::class, 'show'])->name('show');
            Route::put('/', [OperationController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
            Route::delete('/', [OperationController::class, 'destroy'])->middleware('role:admin')->name('destroy');
            Route::post('/start', [OperationController::class, 'start'])->middleware('role:admin,manager,operator')->name('start');
            Route::post('/complete', [OperationController::class, 'complete'])->middleware('role:admin,manager,operator')->name('complete');
            Route::post('/cancel', [OperationController::class, 'cancel'])->middleware('role:admin,manager')->name('cancel');
            Route::get('/documents', [OperationController::class, 'documents'])->name('documents');
        });
    });

    // Module Détentions
    Route::prefix('detentions')->name('detentions.')->group(function () {
        Route::get('/', [DetentionController::class, 'index'])->name('index');
        Route::post('/', [DetentionController::class, 'store'])->middleware('role:admin,manager,operator')->name('store');
        Route::get('/actives', [DetentionController::class, 'actives'])->name('actives');
        Route::get('/resolues', [DetentionController::class, 'resolues'])->name('resolues');
        Route::get('/stats', [DetentionController::class, 'stats'])->name('stats');
        Route::get('/export', [DetentionController::class, 'export'])->name('export');
        
        Route::prefix('{detention}')->group(function () {
            Route::get('/', [DetentionController::class, 'show'])->name('show');
            Route::put('/', [DetentionController::class, 'update'])->middleware('role:admin,manager,operator')->name('update');
            Route::delete('/', [DetentionController::class, 'destroy'])->middleware('role:admin')->name('destroy');
            Route::post('/resolve', [DetentionController::class, 'resolve'])->middleware('role:admin,manager,operator')->name('resolve');
            Route::post('/contest', [DetentionController::class, 'contest'])->middleware('role:admin,manager,operator')->name('contest');
        });
    });

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
});

// Routes de fallback pour API non trouvée
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint API non trouvé',
        'error' => 'Route not found'
    ], 404);
});