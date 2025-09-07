import { apiService } from './apiService';

export interface DoubleRelevage {
  id: number;
  nom_client: string;
  numero_conteneur: string;
  provenance: string;
  camion_ameneur: {
    proprietaire: boolean;
    plaque: string;
    plaque_remorque: string;
  };
  camion_recuperateur: {
    proprietaire: boolean;
    plaque: string;
    plaque_remorque: string;
  };
  montant_operation: number;
  montant_operation_formate: string;
  statut: 'en_attente' | 'confirme' | 'annule';
  statut_label: string;
  date_creation: string;
  date_confirmation?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDoubleRelevageData {
  nom_client: string;
  numero_conteneur: string;
  provenance: string;
  camion_ameneur_proprietaire: boolean;
  camion_ameneur_plaque: string;
  camion_ameneur_remorque: string;
  camion_recuperateur_proprietaire: boolean;
  camion_recuperateur_plaque: string;
  camion_recuperateur_remorque: string;
  montant_operation: number;
  observations?: string;
}

export interface DoubleRelevageStats {
  total_en_attente: number;
  total_confirmees: number;
  operations_aujourdhui: number;
  montant_mensuel: number;
}

class DoubleRelevageService {
  async getDoubleRelevages(params?: {
    statut?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    data: DoubleRelevage[];
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
    const endpoint = queryString ? `/double-relevages?${queryString}` : '/double-relevages';
    const response = await apiService.get(endpoint);
    return {
      data: response.data,
      pagination: response.pagination
    };
  }

  async getDoubleRelevage(id: number): Promise<DoubleRelevage> {
    const response = await apiService.get(`/double-relevages/${id}`);
    return response.data;
  }

  async createDoubleRelevage(data: CreateDoubleRelevageData): Promise<DoubleRelevage> {
    const response = await apiService.post('/double-relevages', data);
    return response.data;
  }

  async updateDoubleRelevage(id: number, data: Partial<CreateDoubleRelevageData>): Promise<DoubleRelevage> {
    const response = await apiService.put(`/double-relevages/${id}`, data);
    return response.data;
  }

  async deleteDoubleRelevage(id: number): Promise<void> {
    await apiService.delete(`/double-relevages/${id}`);
  }

  async confirmerDoubleRelevage(id: number): Promise<DoubleRelevage> {
    const response = await apiService.post(`/double-relevages/${id}/confirmer`, {});
    return response.data;
  }

  async getDoubleRelevagesEnAttente(): Promise<DoubleRelevage[]> {
    const response = await apiService.get('/double-relevages/en-attente');
    return response.data;
  }

  async getStats(): Promise<DoubleRelevageStats> {
    const response = await apiService.get('/double-relevages/stats');
    return response.data;
  }
}

export const doubleRelevageService = new DoubleRelevageService();