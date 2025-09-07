import { apiService } from './apiService';

export interface Stockage {
  id: number;
  nom_client: string;
  numero_conteneur: string;
  provenance: string;
  date_arrivee: string;
  camion_proprietaire: boolean;
  plaque_camion: string;
  plaque_remorque: string;
  jours_gratuits: number;
  prix_par_jour: number;
  prix_par_jour_formate: string;
  statut: 'stocke' | 'en_attente_sortie' | 'sorti';
  statut_label: string;
  date_sortie?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  jours_stockage: number;
  jours_detention: number;
  montant_detention: number;
  montant_detention_formate: string;
}

export interface CreateStockageData {
  nom_client: string;
  numero_conteneur: string;
  provenance: string;
  date_arrivee: string;
  camion_proprietaire: boolean;
  plaque_camion: string;
  plaque_remorque: string;
  jours_gratuits: number;
  prix_par_jour: number;
  observations?: string;
}

export interface SortieStockageData {
  date_sortie: string;
  observations?: string;
}

export interface StockageStats {
  total_stockes: number;
  en_attente_sortie: number;
  sortis_aujourdhui: number;
  montant_detention_mensuel: number;
}

class StockageService {
  async getStockages(params?: {
    statut?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    data: Stockage[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  }> {
    // Construire les paramètres query manuellement
    const queryString = params ? new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    const endpoint = queryString ? `/stockages?${queryString}` : '/stockages';
    const response = await apiService.get(endpoint);
    return {
      data: response.data,
      pagination: response.pagination
    };
  }

  async getStockage(id: number): Promise<Stockage> {
    const response = await apiService.get(`/stockages/${id}`);
    return response.data;
  }

  async createStockage(data: CreateStockageData): Promise<Stockage> {
    const response = await apiService.post('/stockages', data);
    return response.data;
  }

  async updateStockage(id: number, data: Partial<CreateStockageData>): Promise<Stockage> {
    const response = await apiService.put(`/stockages/${id}`, data);
    return response.data;
  }

  async deleteStockage(id: number): Promise<void> {
    await apiService.delete(`/stockages/${id}`);
  }

  async sortieStockage(id: number, data: SortieStockageData): Promise<{
    stockage: Stockage;
    detention: {
      jours: number;
      montant: number;
      montant_formate: string;
    };
  }> {
    const response = await apiService.post(`/stockages/${id}/sortie`, data);
    return {
      stockage: response.data,
      detention: response.detention
    };
  }

  async getStockagesActifs(): Promise<Stockage[]> {
    const response = await apiService.get('/stockages/actifs');
    return response.data;
  }

  async getStats(): Promise<StockageStats> {
    const response = await apiService.get('/stockages/stats');
    return response.data;
  }
}

export const stockageService = new StockageService();