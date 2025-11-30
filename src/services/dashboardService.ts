import { apiService } from './apiService';

export interface DashboardStats {
  sorties: {
    total: number;
    en_cours: number;
    retournees: number;
    aujourd_hui: number;
  };
  vehicules: {
    total: number;
    disponibles: number;
    en_mission: number;
    maintenance: number;
  };
  armateurs: {
    total: number;
    actifs: number;
  };
  operations: {
    total: number;
    planifiees: number;
    en_cours: number;
    terminees: number;
    confirmees: number;
    location: number;
    transport: number;
    revenue_total: number;
    revenue_location: number;
    revenue_transport: number;
  };
  detentions: {
    actives: number;
    montant_total: number;
  };
  facturations: {
    en_attente: number;
    montant_en_attente: number;
  };
}

export interface DashboardActivity {
  id: string | number;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  icon: string;
  color: string;
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activities: DashboardActivity[];
  alerts: DashboardAlert[];
  charts: {
    sorties_par_mois: Array<{ mois: number; total: number }>;
    repartition_statuts: Array<{ statut: string; count: number }>;
    top_armateurs: Array<{ nom: string; sorties: number }>;
    operations_par_type: Array<{ type: string; count: number }>;
  };
}

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiService.get('/dashboard');
    return response.data;
  }

  async getStats(period?: 'day' | 'week' | 'month' | 'year'): Promise<any> {
    const url = period ? `/dashboard/stats?period=${period}` : '/dashboard/stats';
    const response = await apiService.get(url);
    return response.data;
  }

  async getRecentActivities(limit: number = 10): Promise<DashboardActivity[]> {
    const response = await apiService.get(`/dashboard/recent-activity?limit=${limit}`);
    return response.data;
  }

  async getAlerts(): Promise<DashboardAlert[]> {
    const response = await apiService.get('/dashboard/alerts');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
