import type { Armateur, CreateArmateurData } from './armateurService';

// Mock data basée sur les seeders
const mockArmateurs: Armateur[] = [
  // MSC
  { id: 1, code: 'MSC20', nom: 'MSC', contact_nom: 'Mamadou Ba', contact_email: 'mamadou.ba@msc.com', contact_telephone: '+221 33 456 78 90', adresse: 'Terminal MSC, Port de Dakar', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 2, code: 'MSC40', nom: 'MSC', contact_nom: 'Mamadou Ba', contact_email: 'mamadou.ba@msc.com', contact_telephone: '+221 33 456 78 90', adresse: 'Terminal MSC, Port de Dakar', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 3, code: 'MSC20FRGO', nom: 'MSC', contact_nom: 'Mamadou Ba', contact_email: 'mamadou.ba@msc.com', contact_telephone: '+221 33 456 78 90', adresse: 'Terminal MSC, Port de Dakar', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 4, code: 'MSC40FRIGO', nom: 'MSC', contact_nom: 'Mamadou Ba', contact_email: 'mamadou.ba@msc.com', contact_telephone: '+221 33 456 78 90', adresse: 'Terminal MSC, Port de Dakar', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  
  // CMA-CGM
  { id: 5, code: 'CMA20', nom: 'CMA-CGM', contact_nom: 'Ahmed Diallo', contact_email: 'ahmed.diallo@cma-cgm.com', contact_telephone: '+221 33 123 45 67', adresse: 'Zone Portuaire, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 6, code: 'CMA40', nom: 'CMA-CGM', contact_nom: 'Ahmed Diallo', contact_email: 'ahmed.diallo@cma-cgm.com', contact_telephone: '+221 33 123 45 67', adresse: 'Zone Portuaire, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 7, code: 'CMA20FRGO', nom: 'CMA-CGM', contact_nom: 'Ahmed Diallo', contact_email: 'ahmed.diallo@cma-cgm.com', contact_telephone: '+221 33 123 45 67', adresse: 'Zone Portuaire, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 8, code: 'CMA40FRGO', nom: 'CMA-CGM', contact_nom: 'Ahmed Diallo', contact_email: 'ahmed.diallo@cma-cgm.com', contact_telephone: '+221 33 123 45 67', adresse: 'Zone Portuaire, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  
  // MAERSK
  { id: 9, code: 'MRK20', nom: 'MAERSK', contact_nom: 'Fatou Sarr', contact_email: 'fatou.sarr@maersk.com', contact_telephone: '+221 33 987 65 43', adresse: 'Port Autonome, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 10, code: 'MRK40', nom: 'MAERSK', contact_nom: 'Fatou Sarr', contact_email: 'fatou.sarr@maersk.com', contact_telephone: '+221 33 987 65 43', adresse: 'Port Autonome, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 11, code: 'MRK20FRGO', nom: 'MAERSK', contact_nom: 'Fatou Sarr', contact_email: 'fatou.sarr@maersk.com', contact_telephone: '+221 33 987 65 43', adresse: 'Port Autonome, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 12, code: 'MRK40FRGP', nom: 'MAERSK', contact_nom: 'Fatou Sarr', contact_email: 'fatou.sarr@maersk.com', contact_telephone: '+221 33 987 65 43', adresse: 'Port Autonome, Dakar, Sénégal', actif: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

class MockArmateurService {
  private armateurs: Armateur[] = [...mockArmateurs];
  private nextId = 50;

  async getArmateurs(): Promise<Armateur[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.armateurs];
  }

  async getArmateur(id: number): Promise<Armateur> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const armateur = this.armateurs.find(a => a.id === id);
    if (!armateur) {
      throw new Error('Armateur non trouvé');
    }
    return armateur;
  }

  async createArmateur(data: CreateArmateurData): Promise<Armateur> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Vérifier si le code existe déjà
    if (this.armateurs.some(a => a.code === data.code)) {
      throw new Error('Ce code armateur existe déjà');
    }

    const newArmateur: Armateur = {
      id: this.nextId++,
      code: data.code,
      nom: data.nom,
      contact_nom: data.contact_nom,
      contact_email: data.contact_email,
      contact_telephone: data.contact_telephone,
      adresse: data.adresse,
      ville: data.ville,
      pays: data.pays,
      actif: data.actif !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.armateurs.push(newArmateur);
    return newArmateur;
  }

  async updateArmateur(id: number, data: Partial<CreateArmateurData>): Promise<Armateur> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.armateurs.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Armateur non trouvé');
    }

    this.armateurs[index] = {
      ...this.armateurs[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return this.armateurs[index];
  }

  async deleteArmateur(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.armateurs.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Armateur non trouvé');
    }

    this.armateurs.splice(index, 1);
  }
}

export const mockArmateurService = new MockArmateurService();