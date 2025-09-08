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
  private getStoredDepotages(): Depotage[] {
    const stored = localStorage.getItem('depotages');
    return stored ? JSON.parse(stored) : [];
  }

  private saveDepotages(depotages: Depotage[]): void {
    localStorage.setItem('depotages', JSON.stringify(depotages));
  }
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
    console.log('🔄 Loading depotages (localStorage fallback due to backend issues)');
    
    try {
      let depotages = this.getStoredDepotages();
      
      // Apply filters
      if (params?.statut) {
        depotages = depotages.filter(d => d.statut === params.statut);
      }
      
      if (params?.search) {
        const search = params.search.toLowerCase();
        depotages = depotages.filter(d => 
          d.nom_client.toLowerCase().includes(search) ||
          d.numero_conteneur.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const perPage = params?.per_page || 10;
      const page = params?.page || 1;
      const total = depotages.length;
      const lastPage = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const paginatedData = depotages.slice(start, start + perPage);
      
      console.log('✅ Depotages loaded from localStorage:', paginatedData);
      
      return {
        data: paginatedData,
        pagination: {
          total,
          per_page: perPage,
          current_page: page,
          last_page: lastPage
        }
      };
    } catch (error) {
      console.error('❌ Error loading depotages:', error);
      return {
        data: [],
        pagination: {
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 1
        }
      };
    }
  }

  async getDepotage(id: number): Promise<Depotage> {
    const response = await apiService.get(`${apiConfig.endpoints.depotages}/${id}`);
    return response.data;
  }

  async createDepotage(data: CreateDepotageData): Promise<Depotage> {
    console.log('🔄 Creating depotage (localStorage fallback due to backend issues):', data);
    
    const depotages = this.getStoredDepotages();
    const newDepotage: Depotage = {
      id: Date.now(),
      ...data,
      statut: 'en_cours' as const,
      statut_label: 'En cours',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      prix_depotage_formate: `${data.prix_depotage?.toLocaleString()} FCFA`
    };
    
    depotages.push(newDepotage);
    this.saveDepotages(depotages);
    console.log('✅ Depotage created successfully');
    return newDepotage;
  }

  async updateDepotage(id: number, data: Partial<CreateDepotageData>): Promise<Depotage> {
    const response = await apiService.put(`${apiConfig.endpoints.depotages}/${id}`, data);
    return response.data;
  }

  async deleteDepotage(id: number): Promise<void> {
    console.log('🔄 Deleting depotage (localStorage fallback):', id);
    
    const depotages = this.getStoredDepotages();
    const filteredDepotages = depotages.filter(d => d.id !== id);
    this.saveDepotages(filteredDepotages);
    console.log('✅ Depotage deleted successfully');
  }

  async terminerDepotage(id: number): Promise<Depotage> {
    console.log('🔄 Terminating depotage (localStorage fallback):', id);
    
    const depotages = this.getStoredDepotages();
    const depotageIndex = depotages.findIndex(d => d.id === id);
    
    if (depotageIndex === -1) {
      throw new Error('Dépotage non trouvé');
    }
    
    depotages[depotageIndex] = {
      ...depotages[depotageIndex],
      statut: 'termine' as const,
      statut_label: 'Terminé',
      updated_at: new Date().toISOString()
    };
    
    this.saveDepotages(depotages);
    console.log('✅ Depotage terminated successfully');
    return depotages[depotageIndex];
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