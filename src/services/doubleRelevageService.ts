import { apiService } from './apiService';
import { apiConfig } from '../config/api';

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
  private getStoredDoubleRelevages(): DoubleRelevage[] {
    const stored = localStorage.getItem('double_relevages');
    return stored ? JSON.parse(stored) : [];
  }

  private saveDoubleRelevages(doubleRelevages: DoubleRelevage[]): void {
    localStorage.setItem('double_relevages', JSON.stringify(doubleRelevages));
  }

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
    try {
      // Construire les paramètres query manuellement
      const queryString = params ? new URLSearchParams(
        Object.entries(params).filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString() : '';
      const endpoint = queryString ? `${apiConfig.endpoints.doubleRelevages}?${queryString}` : apiConfig.endpoints.doubleRelevages;
      const response = await apiService.get(endpoint);
      return {
        data: response.data,
        pagination: response.pagination
      };
    } catch (error) {
      console.log('🔄 Loading double relevages (localStorage fallback due to backend issues)');
      // Fallback to localStorage
      const saved = this.getStoredDoubleRelevages();
      let filteredData = saved;
      
      if (params?.statut) {
        filteredData = filteredData.filter((item: DoubleRelevage) => item.statut === params.statut);
      }
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredData = filteredData.filter((item: DoubleRelevage) => 
          item.nom_client.toLowerCase().includes(searchLower) ||
          item.numero_conteneur.toLowerCase().includes(searchLower) ||
          item.provenance.toLowerCase().includes(searchLower)
        );
      }

      console.log('✅ Double relevages loaded from localStorage:', filteredData);
      return {
        data: filteredData,
        pagination: {
          total: filteredData.length,
          per_page: params?.per_page || 10,
          current_page: params?.page || 1,
          last_page: Math.ceil(filteredData.length / (params?.per_page || 10))
        }
      };
    }
  }

  async getDoubleRelevage(id: number): Promise<DoubleRelevage> {
    const response = await apiService.get(`${apiConfig.endpoints.doubleRelevages}/${id}`);
    return response.data;
  }

  async createDoubleRelevage(data: CreateDoubleRelevageData): Promise<DoubleRelevage> {
    console.log('🔄 Creating double relevage (localStorage fallback due to backend issues):', data);
    
    try {
      // Try API first, but fallback to localStorage if it fails
      try {
        const response = await apiService.post(apiConfig.endpoints.doubleRelevages, data);
        return response.data;
      } catch (apiError) {
        console.log('⚠️ API failed, using localStorage fallback');
        
        // Create new double relevage locally
        const existingDoubleRelevages = this.getStoredDoubleRelevages();
        const newId = Math.max(0, ...existingDoubleRelevages.map(dr => dr.id)) + 1;
        
        const newDoubleRelevage: DoubleRelevage = {
          id: newId,
          nom_client: data.nom_client,
          numero_conteneur: data.numero_conteneur,
          provenance: data.provenance,
          camion_ameneur: {
            proprietaire: data.camion_ameneur_proprietaire,
            plaque: data.camion_ameneur_plaque,
            plaque_remorque: data.camion_ameneur_remorque
          },
          camion_recuperateur: {
            proprietaire: data.camion_recuperateur_proprietaire,
            plaque: data.camion_recuperateur_plaque,
            plaque_remorque: data.camion_recuperateur_remorque
          },
          montant_operation: data.montant_operation,
          montant_operation_formate: `${data.montant_operation.toLocaleString()} FCFA`,
          statut: 'en_attente',
          statut_label: 'En Attente',
          date_creation: new Date().toISOString().split('T')[0],
          observations: data.observations,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const updatedDoubleRelevages = [...existingDoubleRelevages, newDoubleRelevage];
        this.saveDoubleRelevages(updatedDoubleRelevages);
        
        console.log('✅ Double relevage created successfully in localStorage');
        return newDoubleRelevage;
      }
    } catch (error) {
      console.error('❌ Error creating double relevage:', error);
      throw error;
    }
  }

  async updateDoubleRelevage(id: number, data: Partial<CreateDoubleRelevageData>): Promise<DoubleRelevage> {
    const response = await apiService.put(`${apiConfig.endpoints.doubleRelevages}/${id}`, data);
    return response.data;
  }

  async deleteDoubleRelevage(id: number): Promise<void> {
    await apiService.delete(`${apiConfig.endpoints.doubleRelevages}/${id}`);
  }

  async confirmerDoubleRelevage(id: number): Promise<DoubleRelevage> {
    const response = await apiService.post(`${apiConfig.endpoints.doubleRelevages}/${id}/confirmer`, {});
    return response.data;
  }

  async getDoubleRelevagesEnAttente(): Promise<DoubleRelevage[]> {
    const response = await apiService.get(`${apiConfig.endpoints.doubleRelevages}/en-attente`);
    return response.data;
  }

  async getStats(): Promise<DoubleRelevageStats> {
    const response = await apiService.get(`${apiConfig.endpoints.doubleRelevages}/stats`);
    return response.data;
  }
}

export const doubleRelevageService = new DoubleRelevageService();