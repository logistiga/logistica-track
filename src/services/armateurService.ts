import { apiService } from './apiService';

export interface Armateur {
  id: number;
  code: string;
  nom: string;
  type_conteneur: string;
  jours_gratuits: number;
  prix_par_jour: number;
  contact_nom?: string;
  contact_email?: string;
  contact_telephone?: string;
  adresse?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateArmateurData {
  code: string;
  nom: string;
  type_conteneur: string;
  jours_gratuits: number;
  prix_par_jour: number;
  contact_nom?: string;
  contact_email?: string;
  contact_telephone?: string;
  adresse?: string;
  actif?: boolean;
}

class ArmateurService {
  async getArmateurs(): Promise<Armateur[]> {
    const response = await apiService.get('/armateurs');
    return response.data;
  }

  async getArmateur(id: number): Promise<Armateur> {
    const response = await apiService.get(`/armateurs/${id}`);
    return response.data;
  }

  async createArmateur(data: CreateArmateurData): Promise<Armateur> {
    const response = await apiService.post('/armateurs', data);
    return response.data;
  }

  async updateArmateur(id: number, data: Partial<CreateArmateurData>): Promise<Armateur> {
    const response = await apiService.put(`/armateurs/${id}`, data);
    return response.data;
  }

  async deleteArmateur(id: number): Promise<void> {
    await apiService.delete(`/armateurs/${id}`);
  }
}

export const armateurService = new ArmateurService();