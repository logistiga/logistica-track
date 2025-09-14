import { DetentionContainer } from '@/types/detention';
import { apiService } from './apiService';
import { transformDetentionData } from './detention/mappers';
import { MOCK_DETENTION_STATS } from './detention/mockData';

export interface DetentionStats {
  totalDetentions: number;
  detentionsActives: number;
  detentionsResolues: number;
  detentionsContestees: number;
  coutTotalActif: number;
  coutTotalResolu: number;
  dureeMoyenne: number;
  parResponsabilite: {
    client: number;
    transitaire: number;
    transporteur: number;
    autre: number;
  };
}

export interface DetentionFilters {
  statut?: 'active' | 'resolue' | 'contestee';
  responsabilite?: 'client' | 'logistiga' | 'partagee';
  dateDebut?: string;
  dateFin?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDetentionData {
  sortie_conteneur_id: string;
  cout_par_jour: number;
  responsabilite?: 'client' | 'logistiga' | 'partagee';
  jours_client?: number;
  jours_logistiga?: number;
}

export interface UpdateDetentionData {
  cout_par_jour?: number;
  responsabilite?: 'client' | 'logistiga' | 'partagee';
  jours_client?: number;
  jours_logistiga?: number;
  observations?: string;
}

class DetentionService {
  async getDetentions(filters: DetentionFilters = {}) {
    try {
      const queryParams = this.buildQueryParams(filters);
      const response = await apiService.get(`/detentions?${queryParams}`);
      
      if (response.success && response.data) {
        // Transformer chaque élément des données
        const transformedData = response.data.map((item: any) => this.transformDetentionData(item));
        return {
          ...response,
          data: transformedData
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching detentions:', error);
      throw error;
    }
  }

  async getDetention(id: string) {
    return await apiService.get(`/detentions/${id}`);
  }

  async createDetention(data: CreateDetentionData) {
    return await apiService.post('/detentions', data);
  }

  async updateDetention(id: string, data: UpdateDetentionData) {
    return await apiService.put(`/detentions/${id}`, data);
  }

  async deleteDetention(id: string) {
    return await apiService.delete(`/detentions/${id}`);
  }

  async getActiveDetentions(filters: Omit<DetentionFilters, 'statut'> = {}) {
    return await this.getDetentions({ ...filters, statut: 'active' });
  }

  async getResolvedDetentions(filters: Omit<DetentionFilters, 'statut'> = {}) {
    return await this.getDetentions({ ...filters, statut: 'resolue' });
  }

  async getDetentionStats(filters: Pick<DetentionFilters, 'dateDebut' | 'dateFin'> = {}): Promise<DetentionStats> {
    try {
      const queryParams = this.buildQueryParams(filters);
      const response = await apiService.get(`/detentions/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching detention stats:', error);
      return MOCK_DETENTION_STATS;
    }
  }

  async exportDetentions(filters: DetentionFilters = {}) {
    const queryParams = this.buildQueryParams(filters);
    return await apiService.get(`/detentions/export?${queryParams}`);
  }

  async resolveDetention(id: string, observations?: string) {
    return await apiService.post(`/detentions/${id}/resolve`, { observations });
  }

  async contestDetention(id: string, motif: string) {
    return await apiService.post(`/detentions/${id}/contest`, { motif });
  }

  private buildQueryParams(filters: DetentionFilters): string {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  }

  private transformDetentionData = transformDetentionData;
}

export const detentionService = new DetentionService();