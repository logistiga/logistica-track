<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatistiqueController extends Controller
{
    use ApiResponseTrait;

    /**
     * Get overview statistics
     */
    public function overview(Request $request): JsonResponse
    {
        try {
            $period = $request->input('period', '30'); // Default 30 days
            $startDate = now()->subDays((int)$period);

            $stats = [
                'sorties' => [
                    'total' => $this->getSortiesCount($startDate),
                    'en_cours' => $this->getSortiesCount($startDate, 'en_cours'),
                    'terminees' => $this->getSortiesCount($startDate, 'retourne_port'),
                ],
                'vehicules' => [
                    'total' => $this->getVehiculesCount(),
                    'disponibles' => $this->getVehiculesCount('disponible'),
                    'en_mission' => $this->getVehiculesCount('en_mission'),
                ],
                'detentions' => [
                    'total' => $this->getDetentionsCount($startDate),
                    'actives' => $this->getDetentionsCount($startDate, 'active'),
                    'cout_total' => $this->getDetentionsCost($startDate),
                ],
                'operations' => [
                    'total' => $this->getOperationsCount($startDate),
                    'en_attente' => $this->getOperationsCount($startDate, 'en_attente'),
                    'completees' => $this->getOperationsCount($startDate, 'terminee'),
                ]
            ];

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    /**
     * Get monthly statistics
     */
    public function monthly(Request $request, ?int $year = null, ?int $month = null): JsonResponse
    {
        try {
            $year = $year ?? now()->year;
            $month = $month ?? now()->month;
            
            $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $endDate = $startDate->copy()->endOfMonth();

            $stats = [
                'period' => [
                    'year' => $year,
                    'month' => $month,
                    'month_name' => $startDate->locale('fr')->monthName,
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ],
                'sorties' => $this->getMonthlySortiesStats($startDate, $endDate),
                'vehicules' => $this->getMonthlyVehiculesStats($startDate, $endDate),
                'detentions' => $this->getMonthlyDetentionsStats($startDate, $endDate),
                'operations' => $this->getMonthlyOperationsStats($startDate, $endDate),
            ];

            return $this->successResponse($stats, 'Statistiques mensuelles récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques mensuelles', 500);
        }
    }

    /**
     * Get yearly statistics
     */
    public function yearly(Request $request, ?int $year = null): JsonResponse
    {
        try {
            $year = $year ?? now()->year;
            $startDate = Carbon::createFromDate($year, 1, 1)->startOfYear();
            $endDate = $startDate->copy()->endOfYear();

            $monthlyBreakdown = [];
            for ($month = 1; $month <= 12; $month++) {
                $monthStart = Carbon::createFromDate($year, $month, 1)->startOfMonth();
                $monthEnd = $monthStart->copy()->endOfMonth();
                
                $monthlyBreakdown[] = [
                    'month' => $month,
                    'month_name' => $monthStart->locale('fr')->monthName,
                    'sorties' => $this->getSortiesCount($monthStart, null, $monthEnd),
                    'detentions' => $this->getDetentionsCount($monthStart, null, $monthEnd),
                    'cout_detentions' => $this->getDetentionsCost($monthStart, $monthEnd),
                ];
            }

            $stats = [
                'period' => [
                    'year' => $year,
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ],
                'totals' => [
                    'sorties' => $this->getSortiesCount($startDate, null, $endDate),
                    'detentions' => $this->getDetentionsCount($startDate, null, $endDate),
                    'cout_total_detentions' => $this->getDetentionsCost($startDate, $endDate),
                ],
                'monthly_breakdown' => $monthlyBreakdown,
            ];

            return $this->successResponse($stats, 'Statistiques annuelles récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques annuelles', 500);
        }
    }

    /**
     * Get performance statistics
     */
    public function performance(Request $request): JsonResponse
    {
        try {
            $stats = [
                'kpis' => [
                    'taux_retour_a_temps' => $this->getTauxRetourATemps(),
                    'duree_moyenne_sortie' => $this->getDureeMoyenneSortie(),
                    'taux_detention' => $this->getTauxDetention(),
                    'utilisation_vehicules' => $this->getTauxUtilisationVehicules(),
                ],
                'top_armateurs' => $this->getTopArmateurs(),
                'vehicules_performants' => $this->getVehiculesPerformants(),
                'alertes' => $this->getAlertes(),
            ];

            return $this->successResponse($stats, 'Statistiques de performance récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques de performance', 500);
        }
    }

    /**
     * Get trend statistics
     */
    public function trends(Request $request): JsonResponse
    {
        try {
            $days = (int)$request->input('days', 30);
            $trends = [];

            for ($i = $days; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $trends[] = [
                    'date' => $date->toDateString(),
                    'sorties' => $this->getSortiesCount($date, null, $date->copy()->endOfDay()),
                    'detentions' => $this->getDetentionsCount($date, null, $date->copy()->endOfDay()),
                    'operations' => $this->getOperationsCount($date, null, $date->copy()->endOfDay()),
                ];
            }

            return $this->successResponse([
                'period_days' => $days,
                'trends' => $trends
            ], 'Tendances récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des tendances', 500);
        }
    }

    // Helper methods for statistics calculation

    private function getSortiesCount(Carbon $startDate, ?string $status = null, ?Carbon $endDate = null): int
    {
        $query = DB::table('sortie_conteneurs')
            ->where('created_at', '>=', $startDate);
            
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        
        if ($status) {
            $query->where('statut', $status);
        }

        return $query->count();
    }

    private function getVehiculesCount(?string $status = null): int
    {
        $query = DB::table('vehicules');
        
        // Statut simplifié: on utilise uniquement 'actif'
        if ($status === 'disponible') {
            $query->where('actif', true);
        } elseif ($status === 'en_mission') {
            // Plus de statut en_mission - retourne 0
            return 0;
        }

        return $query->count();
    }

    private function getDetentionsCount(Carbon $startDate, ?string $status = null, ?Carbon $endDate = null): int
    {
        $query = DB::table('detentions')
            ->where('created_at', '>=', $startDate);
            
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        
        if ($status) {
            $query->where('statut', $status);
        }

        return $query->count();
    }

    private function getDetentionsCost(Carbon $startDate, ?Carbon $endDate = null): float
    {
        $query = DB::table('detentions')
            ->where('created_at', '>=', $startDate);
            
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        return (float)$query->sum('cout_total');
    }

    private function getOperationsCount(Carbon $startDate, ?string $status = null, ?Carbon $endDate = null): int
    {
        $query = DB::table('operations')
            ->where('created_at', '>=', $startDate);
            
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        
        if ($status) {
            $query->where('statut', $status);
        }

        return $query->count();
    }

    private function getMonthlySortiesStats(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'total' => $this->getSortiesCount($startDate, null, $endDate),
            'en_cours' => $this->getSortiesCount($startDate, 'en_cours', $endDate),
            'terminees' => $this->getSortiesCount($startDate, 'retourne_port', $endDate),
        ];
    }

    private function getMonthlyVehiculesStats(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'total' => $this->getVehiculesCount(),
            'taux_utilisation' => $this->getTauxUtilisationVehicules(),
        ];
    }

    private function getMonthlyDetentionsStats(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'total' => $this->getDetentionsCount($startDate, null, $endDate),
            'actives' => $this->getDetentionsCount($startDate, 'active', $endDate),
            'cout_total' => $this->getDetentionsCost($startDate, $endDate),
        ];
    }

    private function getMonthlyOperationsStats(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'total' => $this->getOperationsCount($startDate, null, $endDate),
            'completees' => $this->getOperationsCount($startDate, 'terminee', $endDate),
        ];
    }

    private function getTauxRetourATemps(): float
    {
        // Placeholder calculation
        return 85.5;
    }

    private function getDureeMoyenneSortie(): float
    {
        // Placeholder calculation  
        return 7.2;
    }

    private function getTauxDetention(): float
    {
        // Placeholder calculation
        return 12.3;
    }

    private function getTauxUtilisationVehicules(): float
    {
        // Simplifié: retourne le % de véhicules actifs
        $total = $this->getVehiculesCount();
        $actifs = $this->getVehiculesCount('disponible');
        
        return $total > 0 ? ($actifs / $total) * 100 : 0;
    }

    private function getTopArmateurs(): array
    {
        return [
            ['nom' => 'MSC', 'sorties' => 45, 'ca' => 2500000],
            ['nom' => 'CMA CGM', 'sorties' => 38, 'ca' => 2100000],
            ['nom' => 'MAERSK', 'sorties' => 32, 'ca' => 1800000],
        ];
    }

    private function getVehiculesPerformants(): array
    {
        return [
            ['immatriculation' => 'AA-123-BB', 'sorties' => 15, 'taux_disponibilite' => 95],
            ['immatriculation' => 'CC-456-DD', 'sorties' => 12, 'taux_disponibilite' => 92],
            ['immatriculation' => 'EE-789-FF', 'sorties' => 10, 'taux_disponibilite' => 88],
        ];
    }

    private function getAlertes(): array
    {
        return [
            ['type' => 'detention', 'message' => '5 détentions actives dépassent 10 jours'],
            ['type' => 'vehicule', 'message' => '2 véhicules nécessitent une maintenance'],
            ['type' => 'retard', 'message' => '3 retours de conteneurs en retard'],
        ];
    }
}