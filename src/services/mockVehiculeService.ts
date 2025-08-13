import type { Vehicule, CreateVehiculeData } from './vehiculeService';

// Mock data basée sur les seeders
const mockVehicules: Vehicule[] = [
  // Camions
  { id: 1, numero_parc: 'TR 37', immatriculation: 'TR 37', type: 'camion', statut: 'disponible', marque: 'Mercedes', modele: 'Actros', annee: 2020, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, numero_parc: 'tr 07', immatriculation: 'tr 07', type: 'camion', statut: 'en_mission', marque: 'Volvo', modele: 'FH', annee: 2019, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, numero_parc: 'tr 08', immatriculation: 'tr 08', type: 'camion', statut: 'disponible', marque: 'Scania', modele: 'R', annee: 2021, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, numero_parc: 'TR 41', immatriculation: 'TR 41', type: 'camion', statut: 'disponible', marque: 'MAN', modele: 'TGX', annee: 2022, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, numero_parc: 'TR 40', immatriculation: 'LC-362-AA', type: 'camion', statut: 'disponible', marque: 'Mercedes', modele: 'Actros', annee: 2020, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  
  // Remorques (échantillon)
  { id: 101, numero_parc: 'R 01', immatriculation: 'R01', type: 'remorque', statut: 'disponible', annee: 2020, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 102, numero_parc: 'R 02', immatriculation: 'R02', type: 'remorque', statut: 'en_mission', annee: 2019, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 103, numero_parc: 'R 03', immatriculation: 'R03', type: 'remorque', statut: 'disponible', annee: 2021, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 104, numero_parc: 'R 04', immatriculation: 'R04', type: 'remorque', statut: 'maintenance', annee: 2018, actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

class MockVehiculeService {
  private vehicules: Vehicule[] = [...mockVehicules];
  private nextId = 200;

  async getVehicules(): Promise<Vehicule[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.vehicules];
  }

  async getVehicule(id: number): Promise<Vehicule> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const vehicule = this.vehicules.find(v => v.id === id);
    if (!vehicule) {
      throw new Error('Véhicule non trouvé');
    }
    return vehicule;
  }

  async createVehicule(data: CreateVehiculeData): Promise<Vehicule> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newVehicule: Vehicule = {
      id: this.nextId++,
      numero_parc: data.numero_parc,
      immatriculation: data.immatriculation,
      type: data.type,
      statut: data.statut || 'disponible',
      marque: data.marque,
      modele: data.modele,
      annee: data.annee,
      actif: data.actif !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.vehicules.push(newVehicule);
    return newVehicule;
  }

  async updateVehicule(id: number, data: Partial<CreateVehiculeData>): Promise<Vehicule> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.vehicules.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Véhicule non trouvé');
    }

    this.vehicules[index] = {
      ...this.vehicules[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return this.vehicules[index];
  }

  async deleteVehicule(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.vehicules.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Véhicule non trouvé');
    }

    this.vehicules.splice(index, 1);
  }

  async getVehiculesDisponibles(type?: 'camion' | 'remorque'): Promise<Vehicule[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.vehicules.filter(v => {
      const isAvailable = v.statut === 'disponible';
      const matchesType = !type || v.type === type;
      return isAvailable && matchesType;
    });
  }

  async updateStatut(id: number, statut: Vehicule['statut']): Promise<Vehicule> {
    return this.updateVehicule(id, { statut });
  }
}

export const mockVehiculeService = new MockVehiculeService();