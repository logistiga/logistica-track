import { apiService } from './apiService';

export interface Vehicule {
  id: number;
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
  type_label: string;
  libelle_complet: string;
  actif: boolean;
  statut: 'disponible' | 'en_mission' | 'maintenance';
  prochaine_revision?: string | null;
  derniere_revision?: string | null;
  kilometrage?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiculeData {
  numero_parc: string;
  immatriculation: string;
  type: 'camion' | 'remorque';
  actif?: boolean;
  statut?: 'disponible' | 'en_mission' | 'maintenance';
}

class VehiculeService {
  async getVehicules(filters?: Record<string, string>): Promise<Vehicule[]> {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await apiService.get(`/vehicules${params}`);
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
    const params = type ? `?type=${type}` : '';
    const response = await apiService.get(`/vehicules/disponibles${params}`);
    return response.data;
  }

  async getCamions(): Promise<Vehicule[]> {
    const response = await apiService.get('/vehicules/camions');
    return response.data;
  }

  async getRemorques(): Promise<Vehicule[]> {
    const response = await apiService.get('/vehicules/remorques');
    return response.data;
  }
}

export const vehiculeService = new VehiculeService();