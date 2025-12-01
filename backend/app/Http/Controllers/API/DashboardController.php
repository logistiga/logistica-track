<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    /**
     * Tableau de bord principal
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $cacheKey = 'dashboard_main_' . (\Illuminate\Support\Facades\Auth::check() ? \Illuminate\Support\Facades\Auth::id() : 'guest');
            
            $dashboardData = Cache::remember($cacheKey, CACHE_MEDIUM, function () {
                return [
                    'stats' => $this->getMainStats(),
                    'recent_activities' => $this->getRecentActivities(),
                    'alerts' => $this->getAlerts(),
                    'charts' => $this->getChartsData(),
                ];
            });

            return $this->successResponse($dashboardData, 'Données du tableau de bord récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du tableau de bord', 500);
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

        } catch (\Exception $e) {
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

        } catch (\Exception $e) {
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

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des alertes', 500);
        }
    }

    /**
     * Obtenir les statistiques principales
     */
    private function getMainStats(): array
    {
        try {
            // Stats opérations avec détails par type
            $operationsLocation = DB::table('operations')->where('type_operation', 'location')->count();
            $operationsTransport = DB::table('operations')->where('type_operation', 'transport')->count();
            $revenueLocation = DB::table('operations')
                ->where('type_operation', 'location')
                ->whereIn('statut', ['terminee', 'confirmee'])
                ->sum('montant');
            $revenueTransport = DB::table('operations')
                ->where('type_operation', 'transport')
                ->whereIn('statut', ['terminee', 'confirmee'])
                ->sum('montant');

            // Stats détentions
            $detentionsActives = DB::table('detentions')
                ->where('statut', 'active')
                ->count();
            $montantDetentions = DB::table('detentions')
                ->where('statut', 'active')
                ->sum('cout_total');

            // Stats facturations avec correction de la requête
            $facturesEnAttente = DB::table('facturations')
                ->whereIn('statut', ['brouillon', 'envoyee'])
                ->count();
            $montantFacturesEnAttente = DB::table('facturations')
                ->whereIn('statut', ['brouillon', 'envoyee'])
                ->sum('montant_total');

            return [
                'sorties' => [
                    'total' => DB::table('sortie_conteneurs')->count(),
                    'en_cours' => DB::table('sortie_conteneurs')->where('statut', 'en_cours')->count(),
                    'retournees' => DB::table('sortie_conteneurs')->where('statut', 'retourne_port')->count(),
                    'aujourd_hui' => DB::table('sortie_conteneurs')->whereDate('date_sortie', today())->count(),
                ],
                'vehicules' => [
                    'total' => DB::table('vehicules')->count(),
                    'disponibles' => DB::table('vehicules')->where('statut', 'disponible')->count(),
                    'en_mission' => DB::table('vehicules')->where('statut', 'en_mission')->count(),
                    'maintenance' => DB::table('vehicules')->where('statut', 'maintenance')->count(),
                ],
                'armateurs' => [
                    'total' => DB::table('armateurs')->count(),
                    'actifs' => DB::table('armateurs')->where('actif', true)->count(),
                ],
                'operations' => [
                    'total' => DB::table('operations')->count(),
                    'planifiees' => DB::table('operations')->where('statut', 'planifiee')->count(),
                    'en_cours' => DB::table('operations')->where('statut', 'en_cours')->count(),
                    'terminees' => DB::table('operations')->where('statut', 'terminee')->count(),
                    'confirmees' => DB::table('operations')->where('statut', 'confirmee')->count(),
                    'location' => $operationsLocation,
                    'transport' => $operationsTransport,
                    'revenue_total' => $revenueLocation + $revenueTransport,
                    'revenue_location' => $revenueLocation,
                    'revenue_transport' => $revenueTransport,
                ],
                'detentions' => [
                    'actives' => $detentionsActives,
                    'montant_total' => $montantDetentions,
                ],
                'facturations' => [
                    'en_attente' => $facturesEnAttente,
                    'montant_en_attente' => $montantFacturesEnAttente,
                ],
            ];
        } catch (\Exception $e) {
            \Log::error('Dashboard getMainStats error: ' . $e->getMessage());
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

        // Véhicules nécessitant une révision
        $vehiculesRevision = DB::table('vehicules')
            ->where('prochaine_revision', '<=', now()->addDays(7))
            ->where('statut', '!=', 'maintenance')
            ->count();

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
        $detentionsCritiques = DB::table('detentions')
            ->where('statut', 'active')
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

        // Factures en retard
        $facturesRetard = DB::table('facturations')
            ->where('statut', 'envoyee')
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

        return $alerts;
    }

    /**
     * Obtenir les données pour les graphiques
     */
    private function getChartsData(): array
    {
        try {
            // Données pour le graphique des sorties par mois
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

            // Répartition par statut
            $repartitionStatuts = DB::table('sortie_conteneurs')
                ->select('statut', DB::raw('COUNT(*) as count'))
                ->groupBy('statut')
                ->get();

            // Top armateurs - avec gestion des codes armateurs NULL
            $topArmateurs = DB::table('sortie_conteneurs')
                ->join('armateurs', 'sortie_conteneurs.code_armateur', '=', 'armateurs.code')
                ->select('armateurs.nom', DB::raw('COUNT(*) as sorties'))
                ->whereNotNull('sortie_conteneurs.date_sortie')
                ->where('sortie_conteneurs.date_sortie', '>=', now()->subMonths(3))
                ->groupBy('armateurs.nom', 'armateurs.code')
                ->orderBy('sorties', 'desc')
                ->limit(5)
                ->get();

            // Répartition des opérations par type
            $operationsParType = DB::table('operations')
                ->select('type_operation as type', DB::raw('COUNT(*) as count'))
                ->groupBy('type_operation')
                ->get();

            return [
                'sorties_par_mois' => $sortiesParMois,
                'repartition_statuts' => $repartitionStatuts,
                'top_armateurs' => $topArmateurs,
                'operations_par_type' => $operationsParType,
            ];
        } catch (\Exception $e) {
            \Log::error('Dashboard getChartsData error: ' . $e->getMessage());
            // Retourner des données vides en cas d'erreur
            return [
                'sorties_par_mois' => [],
                'repartition_statuts' => [],
                'top_armateurs' => [],
                'operations_par_type' => [],
            ];
        }
    }

    /**
     * Obtenir le début de la période
     */
    private function getPeriodStart(string $period): \Carbon\Carbon
    {
        return match($period) {
            'day' => now()->subDays(30),
            'week' => now()->subWeeks(12),
            'month' => now()->subMonths(12),
            'year' => now()->subYears(5),
            default => now()->subMonths(12)
        };
    }
}