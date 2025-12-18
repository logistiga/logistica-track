import { apiService } from './apiService';

export interface Vehicule {
  id: number;
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
  type_label: string;
  libelle_complet: string;
  actif: boolean;
  statut?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiculeData {
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
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

  async getVehiculesActifs(type?: 'camion' | 'remorque'): Promise<Vehicule[]> {
    const queryParam = type ? `?type=${type}&actif=true` : '?actif=true';
    const response = await apiService.get(`/vehicules${queryParam}`);
    return response.data;
  }
}

export const vehiculeService = new VehiculeService();