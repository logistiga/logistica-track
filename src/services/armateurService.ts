import { apiService } from './apiService';
import { mockArmateurService } from './mockArmateurService';

// Utiliser le service mock en mode développement quand l'API n'est pas accessible
const USE_MOCK = false;

export interface Armateur {
  id: number;
  nom: string;
  code: string;
  contact_nom?: string;
  contact_email?: string;
  contact_telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateArmateurData {
  nom: string;
  code: string;
  contact_nom?: string;
  contact_email?: string;
  contact_telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
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

export const armateurService = USE_MOCK ? mockArmateurService : new ArmateurService();