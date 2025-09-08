import { apiService } from './apiService';
import { apiConfig } from '../config/api';

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
  private getStoredStockages(): Stockage[] {
    const stored = localStorage.getItem('stockages');
    return stored ? JSON.parse(stored) : [];
  }
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
    console.log('🔄 Loading stockages (localStorage fallback due to backend issues)');
    
    try {
      // Try to use localStorage fallback due to backend API issues
      let stockages = this.getStoredStockages();
      
      // Apply filters
      if (params?.statut) {
        stockages = stockages.filter(s => s.statut === params.statut);
      }
      
      if (params?.search) {
        const search = params.search.toLowerCase();
        stockages = stockages.filter(s => 
          s.nom_client.toLowerCase().includes(search) ||
          s.numero_conteneur.toLowerCase().includes(search) ||
          s.provenance.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const perPage = params?.per_page || 10;
      const page = params?.page || 1;
      const total = stockages.length;
      const lastPage = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const paginatedData = stockages.slice(start, start + perPage);
      
      console.log('✅ Stockages loaded from localStorage:', paginatedData);
      
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
      console.error('❌ Error loading stockages:', error);
      // Return empty result on error
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

  async getStockage(id: number): Promise<Stockage> {
    const response = await apiService.get(`${apiConfig.endpoints.stockages}/${id}`);
    return response.data;
  }

  async createStockage(data: CreateStockageData): Promise<Stockage> {
    console.log('🔄 Creating stockage (localStorage fallback due to backend issues):', data);
    
    // Fallback to localStorage due to backend API issues
    const stockages = this.getStoredStockages();
    const newStockage: Stockage = {
      id: Date.now(),
      ...data,
      statut: 'stocke' as const,
      statut_label: 'Stocké',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      jours_stockage: 0,
      jours_detention: 0,
      montant_detention: 0,
      montant_detention_formate: '0 FCFA',
      prix_par_jour_formate: `${data.prix_par_jour.toLocaleString()} FCFA`
    };
    
    stockages.push(newStockage);
    localStorage.setItem('stockages', JSON.stringify(stockages));
    console.log('✅ Stockage created successfully');
    return newStockage;
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
    console.log('🔄 Loading stockage stats (localStorage fallback due to backend issues)');
    
    try {
      const stockages = this.getStoredStockages();
      const today = new Date().toDateString();
      
      const stats: StockageStats = {
        total_stockes: stockages.filter(s => s.statut === 'stocke').length,
        en_attente_sortie: stockages.filter(s => s.statut === 'en_attente_sortie').length,
        sortis_aujourdhui: stockages.filter(s => 
          s.statut === 'sorti' && 
          s.date_sortie && 
          new Date(s.date_sortie).toDateString() === today
        ).length,
        montant_detention_mensuel: stockages
          .filter(s => s.statut === 'stocke')
          .reduce((total, s) => total + s.montant_detention, 0)
      };
      
      console.log('✅ Stockage stats loaded from localStorage:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error loading stockage stats:', error);
      return {
        total_stockes: 0,
        en_attente_sortie: 0,
        sortis_aujourdhui: 0,
        montant_detention_mensuel: 0
      };
    }
  }
}

export const stockageService = new StockageService();