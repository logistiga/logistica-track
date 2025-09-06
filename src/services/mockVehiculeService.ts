import type { Vehicule, CreateVehiculeData } from './vehiculeService';

// Mock data simplifiée alignée avec le backend optimisé
const mockVehicules: Vehicule[] = [
  // Camions
  { id: 1, numero_parc: 'TR 37', immatriculation: 'TR 37', type: 'camion', type_label: 'Camion', libelle_complet: 'TR 37 - TR 37', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, numero_parc: 'tr 07', immatriculation: 'tr 07', type: 'camion', type_label: 'Camion', libelle_complet: 'tr 07 - tr 07', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, numero_parc: 'tr 08', immatriculation: 'tr 08', type: 'camion', type_label: 'Camion', libelle_complet: 'tr 08 - tr 08', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, numero_parc: 'TR 41', immatriculation: 'TR 41', type: 'camion', type_label: 'Camion', libelle_complet: 'TR 41 - TR 41', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 5, numero_parc: 'TR 40', immatriculation: 'LC-362-AA', type: 'camion', type_label: 'Camion', libelle_complet: 'TR 40 - LC-362-AA', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  
  // Remorques (échantillon)
  { id: 101, numero_parc: 'R 01', immatriculation: 'R01', type: 'remorque', type_label: 'Remorque', libelle_complet: 'R 01 - R01', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 102, numero_parc: 'R 02', immatriculation: 'R02', type: 'remorque', type_label: 'Remorque', libelle_complet: 'R 02 - R02', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 103, numero_parc: 'R 03', immatriculation: 'R03', type: 'remorque', type_label: 'Remorque', libelle_complet: 'R 03 - R03', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 104, numero_parc: 'R 04', immatriculation: 'R04', type: 'remorque', type_label: 'Remorque', libelle_complet: 'R 04 - R04', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
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
      type_label: data.type === 'camion' ? 'Camion' : 'Remorque',
      libelle_complet: `${data.numero_parc} - ${data.immatriculation}`,
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

    const updatedVehicule = {
      ...this.vehicules[index],
      ...data,
      libelle_complet: data.numero_parc && data.immatriculation 
        ? `${data.numero_parc} - ${data.immatriculation}`
        : this.vehicules[index].libelle_complet,
      updated_at: new Date().toISOString(),
    };

    this.vehicules[index] = updatedVehicule;
    return updatedVehicule;
  }

  async deleteVehicule(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.vehicules.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Véhicule non trouvé');
    }

    this.vehicules.splice(index, 1);
  }

  async getVehiculesActifs(type?: 'camion' | 'remorque'): Promise<Vehicule[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.vehicules.filter(v => {
      const isActive = v.actif;
      const matchesType = !type || v.type === type;
      return isActive && matchesType;
    });
  }
}

export const mockVehiculeService = new MockVehiculeService();