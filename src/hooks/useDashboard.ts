import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardData } from '@/services/dashboardService';

export function useDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });

  return {
    dashboardData,
    stats: dashboardData?.stats,
    activities: dashboardData?.recent_activities || [],
    alerts: dashboardData?.alerts || [],
    charts: dashboardData?.charts,
    isLoading,
    error,
    refetch,
  };
}
