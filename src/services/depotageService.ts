import { apiService } from './apiService';
import { apiConfig } from '../config/api';

export interface Depotage {
  id: number;
  nom_client: string;
  numero_conteneur: string;
  date_depotage: string;
  camion_proprietaire: boolean;
  plaque_camion: string;
  plaque_remorque: string;
  type_marchandise: string;
  prix_depotage: number;
  prix_depotage_formate: string;
  statut: 'en_cours' | 'termine' | 'annule';
  statut_label: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepotageData {
  nom_client: string;
  numero_conteneur: string;
  date_depotage: string;
  camion_proprietaire: boolean;
  plaque_camion: string;
  plaque_remorque: string;
  type_marchandise: string;
  prix_depotage: number;
  observations?: string;
}

export interface DepotageStats {
  total_en_cours: number;
  termines_aujourdhui: number;
  operations_mois: number;
  montant_mensuel: number;
}

class DepotageService {
  async getDepotages(params?: {
    statut?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    data: Depotage[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  }> {
    const queryString = params ? new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    const endpoint = queryString ? `${apiConfig.endpoints.depotages}?${queryString}` : apiConfig.endpoints.depotages;
    const response = await apiService.get(endpoint);
    return {
      data: response.data,
      pagination: response.pagination
    };
  }

  async getDepotage(id: number): Promise<Depotage> {
    const response = await apiService.get(`${apiConfig.endpoints.depotages}/${id}`);
    return response.data;
  }

  async createDepotage(data: CreateDepotageData): Promise<Depotage> {
    const response = await apiService.post(apiConfig.endpoints.depotages, data);
    return response.data;
  }

  async updateDepotage(id: number, data: Partial<CreateDepotageData>): Promise<Depotage> {
    const response = await apiService.put(`${apiConfig.endpoints.depotages}/${id}`, data);
    return response.data;
  }

  async deleteDepotage(id: number): Promise<void> {
    await apiService.delete(`${apiConfig.endpoints.depotages}/${id}`);
  }

  async terminerDepotage(id: number): Promise<Depotage> {
    const response = await apiService.post(`${apiConfig.endpoints.depotages}/${id}/terminer`, {});
    return response.data;
  }

  async getDepotagesEnCours(): Promise<Depotage[]> {
    const response = await apiService.get(`${apiConfig.endpoints.depotages}/en-cours`);
    return response.data;
  }

  async getStats(): Promise<DepotageStats> {
    const response = await apiService.get(`${apiConfig.endpoints.depotages}/stats`);
    return response.data;
  }
}

export const depotageService = new DepotageService();