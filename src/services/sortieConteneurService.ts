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
  armateur_id: number;
  vehicule_camion_id?: number;
  vehicule_remorque_id?: number;
  nom_client: string;
  adresse_client?: string;
  destination: string;
  type_destination: 'port' | 'client' | 'depot';
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
  vehicule_camion_id?: number;
  vehicule_remorque_id?: number;
  observations?: string;
}

class SortieConteneurService {
  async getSorties(): Promise<SortieConteneur[]> {
    const response = await apiService.get('/sortie-conteneurs');
    return response.data;
  }

  async getSortie(id: number): Promise<SortieConteneur> {
    const response = await apiService.get(`/sortie-conteneurs/${id}`);
    return response.data;
  }

  async createSortie(data: CreateSortieConteneurData): Promise<SortieConteneur> {
    const response = await apiService.post('/sortie-conteneurs', data);
    return response.data;
  }

  async updateSortie(id: number, data: Partial<CreateSortieConteneurData>): Promise<SortieConteneur> {
    const response = await apiService.put(`/sortie-conteneurs/${id}`, data);
    return response.data;
  }

  async deleteSortie(id: number): Promise<void> {
    await apiService.delete(`/sortie-conteneurs/${id}`);
  }

  async confirmerRetour(id: number, retourData: RetourData): Promise<SortieConteneur> {
    const response = await apiService.put(`/sortie-conteneurs/${id}/retour`, retourData);
    return response.data;
  }

  async getSortiesEnCours(): Promise<SortieConteneur[]> {
    const response = await apiService.get('/sortie-conteneurs?statut=en_cours');
    return response.data;
  }

  async getHistorique(): Promise<SortieConteneur[]> {
    const response = await apiService.get('/sortie-conteneurs?statut=retourne_port,livre');
    return response.data;
  }

  async exportSorties(filters?: any): Promise<Blob> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await fetch(`${apiService['API_BASE_URL']}/sortie-conteneurs/export${queryParams}`, {
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