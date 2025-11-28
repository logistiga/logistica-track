import { apiService } from './apiService';
import { apiConfig } from '../config/api';

export interface Stockage {
  id: number;
  sortie_conteneur_id?: number;
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
  sortie_conteneur_id?: number;
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
    const queryParams = new URLSearchParams();
    if (params?.statut) queryParams.append('statut', params.statut);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${apiConfig.endpoints.stockages}?${queryString}` : apiConfig.endpoints.stockages;
    
    const response = await apiService.get(endpoint);
    return {
      data: response.data,
      pagination: response.pagination
    };
  }

  async getStockage(id: number): Promise<Stockage> {
    const response = await apiService.get(`${apiConfig.endpoints.stockages}/${id}`);
    return response.data;
  }

  async createStockage(data: CreateStockageData): Promise<Stockage> {
    const response = await apiService.post(apiConfig.endpoints.stockages, data);
    return response.data;
  }

  async updateStockage(id: number, data: Partial<CreateStockageData>): Promise<Stockage> {
    const response = await apiService.put(`${apiConfig.endpoints.stockages}/${id}`, data);
    return response.data;
  }

  async deleteStockage(id: number): Promise<void> {
    await apiService.delete(`${apiConfig.endpoints.stockages}/${id}`);
  }

  async sortieStockage(id: number, data: SortieStockageData): Promise<{
    stockage: Stockage;
    detention: {
      jours: number;
      montant: number;
      montant_formate: string;
    };
  }> {
    const response = await apiService.post(`${apiConfig.endpoints.stockages}/${id}/sortie`, data);
    return {
      stockage: response.data,
      detention: response.detention
    };
  }

  async getStockagesActifs(): Promise<Stockage[]> {
    const response = await apiService.get(`${apiConfig.endpoints.stockages}/actifs`);
    return response.data;
  }

  async getStats(): Promise<StockageStats> {
    const response = await apiService.get(`${apiConfig.endpoints.stockages}/stats`);
    return response.data;
  }

  async archiverStockage(id: number, data: {
    numero_facture: string;
    date_facturation: string;
    montant_total: number;
    commentaires?: string;
  }): Promise<void> {
    await apiService.post(`${apiConfig.endpoints.stockages}/${id}/archiver`, data);
  }
}

export const stockageService = new StockageService();
