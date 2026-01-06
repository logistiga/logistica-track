<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tableau de bord principal
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $dashboardData = [
                'stats' => $this->getMainStats(),
                'recent_activities' => $this->getRecentActivities(),
                'alerts' => $this->getAlerts(),
                'charts' => $this->getChartsData(),
            ];

            return $this->successResponse($dashboardData, 'Données du tableau de bord récupérées');
        } catch (\Throwable $e) {
            \Log::error('Dashboard index error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            $message = config('app.debug') ? ('Erreur: ' . $e->getMessage()) : 'Erreur interne du serveur';
            return $this->errorResponse($message, 500);
        }
    }

    /**
     * Statistiques principales
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $period = $request->input('period', 'month'); // day, week, month, year
            $cacheKey = "dashboard_stats_{$period}";

            $stats = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($period) {
                return $this->getStatsByPeriod($period);
            });

            return $this->successResponse($stats, 'Statistiques récupérées');
        } catch (\Throwable $e) {
            \Log::error('Dashboard stats error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Activités récentes
     */
    public function recentActivity(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $activities = $this->getRecentActivities($limit);

            return $this->successResponse($activities, 'Activités récentes récupérées');
        } catch (\Throwable $e) {
            \Log::error('Dashboard recentActivity error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return $this->errorResponse('Erreur lors de la récupération des activités', 500);
        }
    }

    /**
     * Alertes du système
     */
    public function alerts(Request $request): JsonResponse
    {
        try {
            $alerts = $this->getAlerts();

            return $this->successResponse($alerts, 'Alertes récupérées');
        } catch (\Throwable $e) {
            \Log::error('Dashboard alerts error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return $this->errorResponse('Erreur lors de la récupération des alertes', 500);
        }
    }

    /**
     * Obtenir les statistiques principales
     */
    private function getMainStats(): array
    {
        try {
            $stats = [
                'sorties' => [
                    'total' => 0,
                    'en_cours' => 0,
                    'retournees' => 0,
                    'aujourd_hui' => 0,
                ],
                'vehicules' => [
                    'total' => 0,
                    'disponibles' => 0,
                    'en_mission' => 0,
                    'maintenance' => 0,
                ],
                'armateurs' => [
                    'total' => 0,
                    'actifs' => 0,
                ],
                'operations' => [
                    'total' => 0,
                    'planifiees' => 0,
                    'en_cours' => 0,
                    'terminees' => 0,
                    'confirmees' => 0,
                    'location' => 0,
                    'transport' => 0,
                    'revenue_total' => 0,
                    'revenue_location' => 0,
                    'revenue_transport' => 0,
                ],
                'detentions' => [
                    'actives' => 0,
                    'montant_total' => 0,
                ],
                'facturations' => [
                    'en_attente' => 0,
                    'montant_en_attente' => 0,
                ],
            ];

            // Sorties conteneurs
            if (Schema::hasTable('sortie_conteneurs')) {
                $statutCol = $this->firstExistingColumn('sortie_conteneurs', ['statut', 'status']);

                $stats['sorties']['total'] = DB::table('sortie_conteneurs')->count();

                if ($statutCol) {
                    $stats['sorties']['en_cours'] = DB::table('sortie_conteneurs')->where($statutCol, 'en_cours')->count();
                    $stats['sorties']['retournees'] = DB::table('sortie_conteneurs')->where($statutCol, 'retourne_port')->count();
                }

                if (Schema::hasColumn('sortie_conteneurs', 'date_sortie')) {
                    $stats['sorties']['aujourd_hui'] = DB::table('sortie_conteneurs')->whereDate('date_sortie', today())->count();
                }
            }

            // Véhicules
            if (Schema::hasTable('vehicules')) {
                $stats['vehicules']['total'] = DB::table('vehicules')->count();

                if (Schema::hasColumn('vehicules', 'actif')) {
                    $stats['vehicules']['disponibles'] = DB::table('vehicules')->where('actif', true)->count();
                    $stats['vehicules']['maintenance'] = DB::table('vehicules')->where('actif', false)->count();
                } else {
                    // Fallback si l'ancien schéma utilise une colonne "statut"
                    $vehiculeStatutCol = $this->firstExistingColumn('vehicules', ['statut', 'status']);
                    if ($vehiculeStatutCol) {
                        $stats['vehicules']['disponibles'] = DB::table('vehicules')->where($vehiculeStatutCol, 'disponible')->count();
                        $stats['vehicules']['en_mission'] = DB::table('vehicules')->where($vehiculeStatutCol, 'en_mission')->count();
                        $stats['vehicules']['maintenance'] = DB::table('vehicules')->where($vehiculeStatutCol, 'maintenance')->count();
                    }
                }
            }

            // Armateurs
            if (Schema::hasTable('armateurs')) {
                $stats['armateurs']['total'] = DB::table('armateurs')->count();

                $armateurActifCol = $this->firstExistingColumn('armateurs', ['actif', 'active', 'is_active']);
                if ($armateurActifCol) {
                    $stats['armateurs']['actifs'] = DB::table('armateurs')->where($armateurActifCol, true)->count();
                }
            }

            // Opérations
            if (Schema::hasTable('operations')) {
                $statusCol = $this->firstExistingColumn('operations', ['statut', 'status']);
                $typeCol = $this->firstExistingColumn('operations', ['type_operation', 'type']);

                $stats['operations']['total'] = DB::table('operations')->count();

                if ($typeCol) {
                    $stats['operations']['location'] = DB::table('operations')->where($typeCol, 'location')->count();
                    $stats['operations']['transport'] = DB::table('operations')->where($typeCol, 'transport')->count();
                }

                if ($statusCol) {
                    $stats['operations']['planifiees'] = DB::table('operations')->where($statusCol, 'planifiee')->count();
                    $stats['operations']['en_cours'] = DB::table('operations')->where($statusCol, 'en_cours')->count();
                    $stats['operations']['terminees'] = DB::table('operations')->where($statusCol, 'terminee')->count();
                    $stats['operations']['confirmees'] = DB::table('operations')->where($statusCol, 'confirmee')->count();
                }

                // Revenus (évite les 500 si des colonnes n'existent pas encore sur le serveur)
                $revenueLocation = 0;
                $revenueTransport = 0;

                if ($statusCol && $typeCol && Schema::hasColumn('operations', 'cout_reel')) {
                    $statusesForRevenue = ['terminee', 'confirmee'];

                    if (Schema::hasColumn('operations', 'tarif_journalier') && Schema::hasColumn('operations', 'duree')) {
                        $revenueLocation = DB::table('operations')
                            ->where($typeCol, 'location')
                            ->whereIn($statusCol, $statusesForRevenue)
                            ->selectRaw('SUM(COALESCE(tarif_journalier * duree, cout_reel, 0)) as total')
                            ->value('total') ?? 0;
                    } else {
                        // Fallback: on utilise cout_reel si tarif_journalier/duree ne sont pas disponibles
                        $revenueLocation = DB::table('operations')
                            ->where($typeCol, 'location')
                            ->whereIn($statusCol, $statusesForRevenue)
                            ->sum('cout_reel') ?? 0;
                    }

                    $revenueTransport = DB::table('operations')
                        ->where($typeCol, 'transport')
                        ->whereIn($statusCol, $statusesForRevenue)
                        ->sum('cout_reel') ?? 0;
                }

                $stats['operations']['revenue_location'] = $revenueLocation;
                $stats['operations']['revenue_transport'] = $revenueTransport;
                $stats['operations']['revenue_total'] = $revenueLocation + $revenueTransport;
            }

            // Détentions
            if (Schema::hasTable('detentions')) {
                $detentionStatutCol = $this->firstExistingColumn('detentions', ['statut', 'status']);

                if ($detentionStatutCol) {
                    $stats['detentions']['actives'] = DB::table('detentions')->where($detentionStatutCol, 'active')->count();

                    if (Schema::hasColumn('detentions', 'cout_total')) {
                        $stats['detentions']['montant_total'] = DB::table('detentions')
                            ->where($detentionStatutCol, 'active')
                            ->sum('cout_total') ?? 0;
                    }
                }
            }

            // Facturations
            if (Schema::hasTable('facturations')) {
                $facturationStatutCol = $this->firstExistingColumn('facturations', ['statut', 'status']);

                if ($facturationStatutCol) {
                    $pending = ['brouillon', 'envoyee'];
                    $stats['facturations']['en_attente'] = DB::table('facturations')->whereIn($facturationStatutCol, $pending)->count();

                    if (Schema::hasColumn('facturations', 'montant_total')) {
                        $stats['facturations']['montant_en_attente'] = DB::table('facturations')->whereIn($facturationStatutCol, $pending)->sum('montant_total') ?? 0;
                    }
                }
            }

            return $stats;
        } catch (\Throwable $e) {
            \Log::error('Dashboard getMainStats error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            throw $e;
        }
    }

    /**
     * Obtenir les statistiques par période
     */
    private function getStatsByPeriod(string $period): array
    {
        $dateField = match($period) {
            'day' => 'DATE(created_at)',
            'week' => 'WEEK(created_at)',
            'month' => 'MONTH(created_at)',
            'year' => 'YEAR(created_at)',
            default => 'DATE(created_at)'
        };

        $sortiesStats = DB::table('sortie_conteneurs')
            ->select(DB::raw("$dateField as period"), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $this->getPeriodStart($period))
            ->groupBy(DB::raw($dateField))
            ->orderBy('period')
            ->get();

        $operationsStats = DB::table('operations')
            ->select(DB::raw("$dateField as period"), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', $this->getPeriodStart($period))
            ->groupBy(DB::raw($dateField))
            ->orderBy('period')
            ->get();

        return [
            'sorties' => $sortiesStats,
            'operations' => $operationsStats,
            'period' => $period,
        ];
    }

    /**
     * Obtenir les activités récentes
     */
    private function getRecentActivities(int $limit = 10): array
    {
        // Simuler des activités récentes (à remplacer par une vraie table d'audit)
        return [
            [
                'id' => 1,
                'type' => 'sortie_created',
                'description' => 'Nouvelle sortie créée: ABCD1234567',
                'user' => 'Jean Dupont',
                'timestamp' => now()->subMinutes(5)->toISOString(),
                'icon' => 'truck',
                'color' => 'blue',
            ],
            [
                'id' => 2,
                'type' => 'vehicule_maintenance',
                'description' => 'Véhicule TR 37 en maintenance',
                'user' => 'Marie Martin',
                'timestamp' => now()->subMinutes(15)->toISOString(),
                'icon' => 'wrench',
                'color' => 'orange',
            ],
            [
                'id' => 3,
                'type' => 'operation_completed',
                'description' => 'Opération OP001 terminée',
                'user' => 'Pierre Paul',
                'timestamp' => now()->subMinutes(30)->toISOString(),
                'icon' => 'check',
                'color' => 'green',
            ],
        ];
    }

    /**
     * Obtenir les alertes système
     */
    private function getAlerts(): array
    {
        $alerts = [];

        // Véhicules nécessitant une révision (nécessite migration)
        $vehiculesRevision = 0;

        if ($vehiculesRevision > 0) {
            $alerts[] = [
                'id' => 'vehicules_revision',
                'type' => 'warning',
                'title' => 'Révisions à prévoir',
                'message' => "$vehiculesRevision véhicule(s) nécessitent une révision dans les 7 prochains jours",
                'action_url' => '/vehicules?filter=revision_due',
                'priority' => 'medium',
            ];
        }

        // Conteneurs en détention critique
        if (Schema::hasTable('detentions')) {
            $detentionStatutCol = $this->firstExistingColumn('detentions', ['statut', 'status']);

            if ($detentionStatutCol && Schema::hasColumn('detentions', 'jours_detention')) {
                $detentionsCritiques = DB::table('detentions')
                    ->where($detentionStatutCol, 'active')
                    ->where('jours_detention', '>', 10)
                    ->count();

                if ($detentionsCritiques > 0) {
                    $alerts[] = [
                        'id' => 'detentions_critiques',
                        'type' => 'error',
                        'title' => 'Détentions critiques',
                        'message' => "$detentionsCritiques conteneur(s) en détention depuis plus de 10 jours",
                        'action_url' => '/detentions?filter=critical',
                        'priority' => 'high',
                    ];
                }
            }
        }

        // Factures en retard
        if (Schema::hasTable('facturations')) {
            $facturationStatutCol = $this->firstExistingColumn('facturations', ['statut', 'status']);

            if ($facturationStatutCol && Schema::hasColumn('facturations', 'date_echeance')) {
                $facturesRetard = DB::table('facturations')
                    ->where($facturationStatutCol, 'envoyee')
                    ->where('date_echeance', '<', now())
                    ->count();

                if ($facturesRetard > 0) {
                    $alerts[] = [
                        'id' => 'factures_retard',
                        'type' => 'warning',
                        'title' => 'Factures en retard',
                        'message' => "$facturesRetard facture(s) dépassent la date d'échéance",
                        'action_url' => '/facturations?filter=overdue',
                        'priority' => 'medium',
                    ];
                }
            }
        }

        return $alerts;
    }

    /**
     * Obtenir les données pour les graphiques
     */
    private function getChartsData(): array
    {
        try {
            $sortiesParMois = [];
            $repartitionStatuts = [];
            $topArmateurs = [];
            $operationsParType = [];

            // Sorties par mois
            if (Schema::hasTable('sortie_conteneurs') && Schema::hasColumn('sortie_conteneurs', 'date_sortie')) {
                $sortiesParMois = DB::table('sortie_conteneurs')
                    ->select(
                        DB::raw('MONTH(date_sortie) as mois'),
                        DB::raw('COUNT(*) as total')
                    )
                    ->whereNotNull('date_sortie')
                    ->where('date_sortie', '>=', now()->subMonths(12))
                    ->groupBy(DB::raw('MONTH(date_sortie)'))
                    ->orderBy('mois')
                    ->get();
            }

            // Répartition par statut
            if (Schema::hasTable('sortie_conteneurs')) {
                $statutCol = $this->firstExistingColumn('sortie_conteneurs', ['statut', 'status']);
                if ($statutCol) {
                    $repartitionStatuts = DB::table('sortie_conteneurs')
                        ->select($statutCol . ' as statut', DB::raw('COUNT(*) as count'))
                        ->groupBy($statutCol)
                        ->get();
                }
            }

            // Top armateurs
            if (
                Schema::hasTable('sortie_conteneurs') &&
                Schema::hasTable('armateurs') &&
                Schema::hasColumn('sortie_conteneurs', 'code_armateur') &&
                Schema::hasColumn('armateurs', 'code') &&
                Schema::hasColumn('armateurs', 'nom') &&
                Schema::hasColumn('sortie_conteneurs', 'date_sortie')
            ) {
                $topArmateurs = DB::table('sortie_conteneurs')
                    ->join('armateurs', 'sortie_conteneurs.code_armateur', '=', 'armateurs.code')
                    ->select('armateurs.nom', DB::raw('COUNT(*) as sorties'))
                    ->whereNotNull('sortie_conteneurs.date_sortie')
                    ->where('sortie_conteneurs.date_sortie', '>=', now()->subMonths(3))
                    ->groupBy('armateurs.nom', 'armateurs.code')
                    ->orderBy('sorties', 'desc')
                    ->limit(5)
                    ->get();
            }

            // Répartition des opérations par type
            if (Schema::hasTable('operations')) {
                $typeCol = $this->firstExistingColumn('operations', ['type_operation', 'type']);
                if ($typeCol) {
                    $operationsParType = DB::table('operations')
                        ->select($typeCol . ' as type', DB::raw('COUNT(*) as count'))
                        ->groupBy($typeCol)
                        ->get();
                }
            }

            return [
                'sorties_par_mois' => $sortiesParMois,
                'repartition_statuts' => $repartitionStatuts,
                'top_armateurs' => $topArmateurs,
                'operations_par_type' => $operationsParType,
            ];
        } catch (\Throwable $e) {
            \Log::error('Dashboard getChartsData error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return [
                'sorties_par_mois' => [],
                'repartition_statuts' => [],
                'top_armateurs' => [],
                'operations_par_type' => [],
            ];
        }
    }

    /**
     * Trouver la première colonne existante (utile quand le serveur n'est pas à jour)
     */
    private function firstExistingColumn(string $table, array $candidates): ?string
    {
        foreach ($candidates as $column) {
            if (Schema::hasColumn($table, $column)) {
                return $column;
            }
        }

        return null;
    }

    /**
     * Obtenir le début de la période
     */
    private function getPeriodStart(string $period): \Carbon\Carbon
    {
        return match ($period) {
            'day' => now()->subDays(30),
            'week' => now()->subWeeks(12),
            'month' => now()->subMonths(12),
            'year' => now()->subYears(5),
            default => now()->subMonths(12),
        };
    }
}