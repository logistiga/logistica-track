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
      console.log('📡 Service: Fetching sorties from API...');
      const response = await apiService.get('/sorties');
      console.log('📥 Service: API response received with', response.data.length, 'sorties');
      console.log('📊 Service: Sorties statuses:', response.data.map((s: SortieConteneur) => ({ id: s.id, statut: s.statut })));
      return response.data;
    } catch (error) {
      console.error('❌ Service: API call failed, trying localStorage fallback:', error);
      
      // Fallback to localStorage
      const stored = this.getStoredSorties();
      console.log('📊 Service: localStorage fallback data:', stored.map(s => ({ id: s.id, statut: s.statut })));
      
      if (stored.length === 0) {
        console.warn('⚠️ Service: No data in localStorage either');
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

  async confirmerRetour(id: number, retourData: RetourData): Promise<SortieConteneur> {
    console.log('🔄 Service: Confirming return for sortie ID:', id);
    console.log('📤 Service: Return data received:', retourData);
    
    try {
      // Try API first
      try {
        console.log('📡 Service: Attempting API call for return confirmation...');
        const response = await apiService.post(`/sorties/${id}/return`, retourData);
        console.log('📥 Service: API response received:', response.data);
        console.log('📈 Service: API returned status:', response.data.statut);
        
        // Verify the API actually updated the status
        if (response.data.statut !== 'retourne_port') {
          console.warn('⚠️ Service: API did not set status to retourne_port, status is:', response.data.statut);
        }
        
        return response.data;
      } catch (apiError: any) {
        console.error('❌ Service: API call failed with detailed error:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          url: apiError.config?.url,
          method: apiError.config?.method
        });
        
        // Fallback to localStorage
        let sorties = this.getStoredSorties();
        console.log('📊 Service: Current localStorage sorties:', sorties.map(s => ({ id: s.id, statut: s.statut })));
        
        // If localStorage is empty, try to get fresh data from API
        if (sorties.length === 0) {
          try {
            const response = await apiService.get('/sorties');
            sorties = response.data;
            console.log('📥 Service: Retrieved fresh data from API for localStorage update');
          } catch (getError) {
            console.error('❌ Service: Could not retrieve data from API:', getError);
            throw new Error('Impossible de récupérer les données pour la mise à jour');
          }
        }
        
        // Update the sortie with return data
        const sortieIndex = sorties.findIndex((s: SortieConteneur) => s.id === id);
        if (sortieIndex === -1) {
          console.error('❌ Service: Sortie not found in data:', id);
          throw new Error('Sortie non trouvée');
        }
        
        console.log('📊 Service: Found sortie at index:', sortieIndex);
        console.log('📈 Service: Current sortie status:', sorties[sortieIndex].statut);
        
        const updatedSortie = {
          ...sorties[sortieIndex],
          date_retour: retourData.date_retour,
          heure_retour: retourData.heure_retour || "12:00",
          statut: 'retourne_port' as const,
          updated_at: new Date().toISOString()
        };
        
        console.log('🔄 Service: Updated sortie object:', updatedSortie);
        console.log('📈 Service: New status:', updatedSortie.statut);
        
        sorties[sortieIndex] = updatedSortie;
        
        // Save to localStorage
        this.saveSorties(sorties);
        console.log('💾 Service: Saved updated data to localStorage');
        
        return updatedSortie;
      }
    } catch (error) {
      console.error('❌ Service: Critical error in confirmerRetour:', error);
      throw error;
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