import { apiService } from './apiService';

export interface SortieConteneur {
  id: number;
  numero_conteneur: string;
  numero_bl: string;
  armateur_id: number;
  vehicule_camion_id?: number;
  vehicule_remorque_id?: number;
  nom_client: string;
  adresse_client?: string;
  destination: string;
  type_destination: 'port' | 'client' | 'depot';
  date_sortie: string;
  heure_sortie?: string;
  date_retour?: string;
  heure_retour?: string;
  statut: 'en_cours' | 'retourne_port' | 'livre';
  prime_chauffeur?: number;
  jours_bad?: number;
  date_fin_franchise?: string;
  nom_transitaire?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  armateur?: {
    id: number;
    nom: string;
    code: string;
  };
  vehicule_camion?: {
    id: number;
    numero_parc: string;
    immatriculation: string;
  };
  vehicule_remorque?: {
    id: number;
    numero_parc: string;
    immatriculation: string;
  };
  camion?: {
    id: number;
    numero_parc: string;
    immatriculation: string;
    libelle_complet: string;
  };
  remorque?: {
    id: number;
    numero_parc: string;
    immatriculation: string;
    libelle_complet: string;
  };
  camion_id?: number;
  remorque_id?: number;
}

export interface CreateSortieConteneurData {
  numero_conteneur: string;
  numero_bl: string;
  code_armateur: string;
  camion_id?: number;
  remorque_id?: number;
  nom_client: string;
  adresse_client?: string;
  destination: 'base' | 'client';
  type_destination: 'bad' | 'detention';
  date_sortie: string;
  heure_sortie?: string;
  prime_chauffeur?: number;
  jours_bad?: number;
  date_fin_franchise?: string;
  nom_transitaire?: string;
  observations?: string;
}

export interface RetourData {
  date_retour: string;
  heure_retour?: string;
  camion_retour_id?: number;
  remorque_retour_id?: number;
  observations?: string;
}

class SortieConteneurService {
  private getStoredSorties(): SortieConteneur[] {
    const stored = localStorage.getItem('sorties_conteneurs');
    return stored ? JSON.parse(stored) : [];
  }

  private saveSorties(sorties: SortieConteneur[]): void {
    localStorage.setItem('sorties_conteneurs', JSON.stringify(sorties));
  }
  async getSorties(): Promise<SortieConteneur[]> {
    try {
      const response = await apiService.get('/sorties');
      // Format API: { success, message, data: { data: [...] , meta, links } }
      const payload = response.data;
      const list = payload?.data?.data ?? payload?.data ?? payload;
      return Array.isArray(list) ? list : [];
    } catch (error) {
      // Fallback to localStorage
      const stored = this.getStoredSorties();
      if (stored.length === 0) {
        console.warn('No data available from API or localStorage');
      }
      return stored;
    }
  }

  async getSortie(id: number): Promise<SortieConteneur> {
    const response = await apiService.get(`/sorties/${id}`);
    return response.data;
  }

  async createSortie(data: CreateSortieConteneurData): Promise<SortieConteneur> {
    const response = await apiService.post('/sorties', data);
    return response.data;
  }

  async updateSortie(id: number, data: Partial<CreateSortieConteneurData>): Promise<SortieConteneur> {
    const response = await apiService.put(`/sorties/${id}`, data);
    return response.data;
  }

  async deleteSortie(id: number): Promise<void> {
    await apiService.delete(`/sorties/${id}`);
  }

  async archiverSortie(id: number): Promise<SortieConteneur> {
    const response = await apiService.post(`/sorties/${id}/archiver`, {});
    return response.data;
  }

  async confirmerRetour(id: number, retourData: RetourData): Promise<SortieConteneur> {
    try {
      const response = await apiService.post(`/sorties/${id}/return`, retourData);
      
      const updatedSortie = {
        ...response.data,
        statut: 'retourne_port' as const,
        date_retour: retourData.date_retour,
        heure_retour: retourData.heure_retour || "12:00"
      };
      
      // Update localStorage
      const sorties = this.getStoredSorties();
      const updatedSorties = sorties.map(s => s.id === id ? updatedSortie : s);
      this.saveSorties(updatedSorties);
      
      return updatedSortie;
      
    } catch (apiError: any) {
      // Fallback to localStorage
      let sorties = this.getStoredSorties();
      
      if (sorties.length === 0) {
        try {
          const response = await apiService.get('/sorties');
          sorties = response.data;
        } catch (getError) {
          throw new Error('Impossible de récupérer les données pour la mise à jour');
        }
      }
      
      const sortieIndex = sorties.findIndex((s: SortieConteneur) => s.id === id);
      if (sortieIndex === -1) {
        throw new Error('Sortie non trouvée');
      }
      
      const updatedSortie = {
        ...sorties[sortieIndex],
        date_retour: retourData.date_retour,
        heure_retour: retourData.heure_retour || "12:00",
        statut: 'retourne_port' as const,
        updated_at: new Date().toISOString()
      };
      
      sorties[sortieIndex] = updatedSortie;
      this.saveSorties(sorties);
      
      return updatedSortie;
    }
  }

  async getSortiesEnCours(): Promise<SortieConteneur[]> {
    const response = await apiService.get('/sorties/en-cours');
    return response.data;
  }

  async getHistorique(): Promise<SortieConteneur[]> {
    const response = await apiService.get('/sorties/retournees');
    return response.data;
  }

  async exportSorties(filters?: any): Promise<Blob> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await fetch(`${apiService['API_BASE_URL']}/sorties/export${queryParams}`, {
      method: 'GET',
      headers: apiService['getAuthHeaders'](),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }

    return await response.blob();
  }
}

export const sortieConteneurService = new SortieConteneurService();