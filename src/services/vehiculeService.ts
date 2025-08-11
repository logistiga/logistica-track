import { apiService } from './apiService';

export interface Vehicule {
  id: number;
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
  marque?: string;
  modele?: string;
  annee?: number;
  statut: 'disponible' | 'en_mission' | 'maintenance' | 'hors_service';
  derniere_mission?: string;
  kilometrage?: number;
  date_derniere_revision?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiculeData {
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
  marque?: string;
  modele?: string;
  annee?: number;
  statut?: 'disponible' | 'en_mission' | 'maintenance' | 'hors_service';
  kilometrage?: number;
  date_derniere_revision?: string;
  actif?: boolean;
}

class VehiculeService {
  async getVehicules(): Promise<Vehicule[]> {
    const response = await apiService.get('/vehicules');
    return response.data;
  }

  async getVehicule(id: number): Promise<Vehicule> {
    const response = await apiService.get(`/vehicules/${id}`);
    return response.data;
  }

  async createVehicule(data: CreateVehiculeData): Promise<Vehicule> {
    const response = await apiService.post('/vehicules', data);
    return response.data;
  }

  async updateVehicule(id: number, data: Partial<CreateVehiculeData>): Promise<Vehicule> {
    const response = await apiService.put(`/vehicules/${id}`, data);
    return response.data;
  }

  async deleteVehicule(id: number): Promise<void> {
    await apiService.delete(`/vehicules/${id}`);
  }

  async getVehiculesDisponibles(type?: 'camion' | 'remorque'): Promise<Vehicule[]> {
    const queryParam = type ? `?type=${type}&statut=disponible` : '?statut=disponible';
    const response = await apiService.get(`/vehicules${queryParam}`);
    return response.data;
  }

  async updateStatut(id: number, statut: Vehicule['statut']): Promise<Vehicule> {
    const response = await apiService.put(`/vehicules/${id}/statut`, { statut });
    return response.data;
  }
}

export const vehiculeService = new VehiculeService();