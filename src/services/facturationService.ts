import { apiService } from './apiService';
import { FactureInterne, CreateFactureData } from '@/types/facturation';

export class FacturationService {
  async getFacturations(filters?: {
    statut?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<FactureInterne[]> {
    console.log('🔍 Fetching facturations with filters:', filters);
    
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.dateDebut) params.append('date_debut', filters.dateDebut);
    if (filters?.dateFin) params.append('date_fin', filters.dateFin);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/facturations?${queryString}` : '/facturations';
    
    const response = await apiService.get(endpoint);
    
    console.log('📦 API Response:', response);
    
    if (response.success && response.data) {
      console.log('✅ Factures récupérées:', response.data.length);
      return response.data.map(this.transformFacturation);
    }
    
    throw new Error(response.message || 'Erreur lors de la récupération des facturations');
  }

  async getFacturation(id: string): Promise<FactureInterne> {
    const response = await apiService.get(`/facturations/${id}`);
    
    if (response.success && response.data) {
      return this.transformFacturation(response.data);
    }
    
    throw new Error(response.message || 'Erreur lors de la récupération de la facturation');
  }

  async createFacturation(data: CreateFactureData): Promise<FactureInterne> {
    const response = await apiService.post('/facturations', data);
    
    if (response.success && response.data) {
      return this.transformFacturation(response.data);
    }
    
    throw new Error(response.message || 'Erreur lors de la création de la facturation');
  }

  async updateFacturation(id: string, data: Partial<CreateFactureData>): Promise<FactureInterne> {
    const response = await apiService.put(`/facturations/${id}`, data);
    
    if (response.success && response.data) {
      return this.transformFacturation(response.data);
    }
    
    throw new Error(response.message || 'Erreur lors de la mise à jour de la facturation');
  }

  async deleteFacturation(id: string): Promise<void> {
    const response = await apiService.delete(`/facturations/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la suppression de la facturation');
    }
  }

  async sendFacturation(id: string): Promise<FactureInterne> {
    const response = await apiService.post(`/facturations/${id}/send`, {});
    
    if (response.success && response.data) {
      return this.transformFacturation(response.data);
    }
    
    throw new Error(response.message || 'Erreur lors de l\'envoi de la facturation');
  }

  async markAsPaid(id: string): Promise<FactureInterne> {
    const response = await apiService.post(`/facturations/${id}/pay`, {});
    
    if (response.success && response.data) {
      return this.transformFacturation(response.data);
    }
    
    throw new Error(response.message || 'Erreur lors de la confirmation du paiement');
  }

  async generatePDF(id: string): Promise<Blob> {
    const response = await fetch(`${apiService['baseUrl']}/facturations/${id}/pdf`, {
      headers: apiService['getAuthHeaders'](),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la génération du PDF');
    }
    
    return response.blob();
  }

  async getStats(): Promise<{
    totalBrouillons: number;
    totalEnvoyees: number;
    totalPayees: number;
    montantTotal: number;
    montantEnAttente: number;
  }> {
    const response = await apiService.get('/facturations/stats');
    
    if (response.success && response.data) {
      return {
        totalBrouillons: response.data.total_brouillons || 0,
        totalEnvoyees: response.data.total_envoyees || 0,
        totalPayees: response.data.total_payees || 0,
        montantTotal: parseFloat(response.data.montant_total || 0),
        montantEnAttente: parseFloat(response.data.montant_en_attente || 0),
      };
    }
    
    throw new Error(response.message || 'Erreur lors de la récupération des statistiques');
  }

  private transformFacturation(data: any): FactureInterne {
    return {
      id: data.id?.toString() || '',
      numeroFacture: data.numero_facture || '',
      dateFacture: data.date_facture || '',
      typeOperation: data.type_operation || 'stockage',
      numeroConteneur: data.sortie_conteneur?.numero_conteneur || data.numero_conteneur || '',
      nomClient: data.sortie_conteneur?.nom_client || data.nom_client || '',
      montantAPayer: parseFloat(data.montant_total || 0),
      dateSortieOperation: data.sortie_conteneur?.date_sortie || data.date_sortie_operation || '',
      statutPaiement: data.statut || 'brouillon',
      joursGratuits: data.jours_gratuits,
      joursPayants: data.jours_payants,
      tarifJournalier: data.tarif_journalier ? parseFloat(data.tarif_journalier) : undefined,
      montantTva: data.montant_tva ? parseFloat(data.montant_tva) : undefined,
      montantTtc: data.montant_ttc ? parseFloat(data.montant_ttc) : undefined,
      notes: data.notes,
    };
  }
}

export const facturationService = new FacturationService();
