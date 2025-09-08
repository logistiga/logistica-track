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
  private storageKey = 'stockages';
  private currentId = 1;

  private getFromStorage(): Stockage[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(stockages: Stockage[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stockages));
  }

  private generateId(): number {
    const stockages = this.getFromStorage();
    const maxId = Math.max(0, ...stockages.map(s => s.id));
    return maxId + 1;
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
    console.log('🔍 Chargement des stockages depuis localStorage');
    let stockages = this.getFromStorage();
    
    // Filtrer par statut si spécifié
    if (params?.statut) {
      stockages = stockages.filter(s => s.statut === params.statut);
    }
    
    // Filtrer par recherche si spécifié
    if (params?.search) {
      const search = params.search.toLowerCase();
      stockages = stockages.filter(s => 
        s.nom_client.toLowerCase().includes(search) ||
        s.numero_conteneur.toLowerCase().includes(search) ||
        s.provenance.toLowerCase().includes(search)
      );
    }

    return {
      data: stockages,
      pagination: {
        total: stockages.length,
        per_page: params?.per_page || 50,
        current_page: params?.page || 1,
        last_page: 1
      }
    };
  }

  async getStockage(id: number): Promise<Stockage> {
    const stockages = this.getFromStorage();
    const stockage = stockages.find(s => s.id === id);
    if (!stockage) {
      throw new Error('Stockage non trouvé');
    }
    return stockage;
  }

  async createStockage(data: CreateStockageData): Promise<Stockage> {
    console.log('📦 Création stockage:', data);
    const stockages = this.getFromStorage();
    const now = new Date().toISOString();
    
    const newStockage: Stockage = {
      id: this.generateId(),
      nom_client: data.nom_client,
      numero_conteneur: data.numero_conteneur,
      provenance: data.provenance,
      date_arrivee: data.date_arrivee,
      camion_proprietaire: data.camion_proprietaire,
      plaque_camion: data.plaque_camion,
      plaque_remorque: data.plaque_remorque,
      jours_gratuits: data.jours_gratuits,
      prix_par_jour: data.prix_par_jour,
      prix_par_jour_formate: `${data.prix_par_jour.toLocaleString()} FCFA`,
      statut: 'stocke',
      statut_label: 'Stocké',
      observations: data.observations,
      created_at: now,
      updated_at: now,
      jours_stockage: 0,
      jours_detention: 0,
      montant_detention: 0,
      montant_detention_formate: '0 FCFA'
    };

    stockages.push(newStockage);
    this.saveToStorage(stockages);
    return newStockage;
  }

  async updateStockage(id: number, data: Partial<CreateStockageData>): Promise<Stockage> {
    const stockages = this.getFromStorage();
    const index = stockages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stockage non trouvé');
    }

    stockages[index] = {
      ...stockages[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage(stockages);
    return stockages[index];
  }

  async deleteStockage(id: number): Promise<void> {
    const stockages = this.getFromStorage();
    const filteredStockages = stockages.filter(s => s.id !== id);
    this.saveToStorage(filteredStockages);
  }

  async sortieStockage(id: number, data: SortieStockageData): Promise<{
    stockage: Stockage;
    detention: {
      jours: number;
      montant: number;
      montant_formate: string;
    };
  }> {
    const stockages = this.getFromStorage();
    const index = stockages.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Stockage non trouvé');
    }

    const stockage = stockages[index];
    const dateArrivee = new Date(stockage.date_arrivee);
    const dateSortie = new Date(data.date_sortie);
    const joursTotal = Math.ceil((dateSortie.getTime() - dateArrivee.getTime()) / (1000 * 3600 * 24));
    const joursDetention = Math.max(0, joursTotal - stockage.jours_gratuits);
    const montantDetention = joursDetention * stockage.prix_par_jour;

    stockages[index] = {
      ...stockage,
      statut: 'sorti',
      statut_label: 'Sorti',
      date_sortie: data.date_sortie,
      observations: data.observations,
      jours_stockage: joursTotal,
      jours_detention: joursDetention,
      montant_detention: montantDetention,
      montant_detention_formate: `${montantDetention.toLocaleString()} FCFA`,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage(stockages);

    return {
      stockage: stockages[index],
      detention: {
        jours: joursDetention,
        montant: montantDetention,
        montant_formate: `${montantDetention.toLocaleString()} FCFA`
      }
    };
  }

  async getStockagesActifs(): Promise<Stockage[]> {
    const stockages = this.getFromStorage();
    return stockages.filter(s => s.statut === 'stocke');
  }

  async getStats(): Promise<StockageStats> {
    const stockages = this.getFromStorage();
    const totalStockes = stockages.filter(s => s.statut === 'stocke').length;
    const enAttenteSortie = stockages.filter(s => s.statut === 'en_attente_sortie').length;
    const sortisAujourdhui = stockages.filter(s => {
      return s.date_sortie && new Date(s.date_sortie).toDateString() === new Date().toDateString();
    }).length;
    const montantDetentionMensuel = stockages
      .filter(s => s.date_sortie && new Date(s.date_sortie).getMonth() === new Date().getMonth())
      .reduce((total, s) => total + s.montant_detention, 0);

    return {
      total_stockes: totalStockes,
      en_attente_sortie: enAttenteSortie,
      sortis_aujourdhui: sortisAujourdhui,
      montant_detention_mensuel: montantDetentionMensuel
    };
  }
}

export const stockageService = new StockageService();