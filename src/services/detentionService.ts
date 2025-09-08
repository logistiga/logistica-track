import { apiService } from './apiService';
import { DetentionContainer } from '@/types/detention';

export interface DetentionStats {
  totalDetentions: number;
  detentionsActives: number;
  detentionsResolues: number;
  detentionsContestees: number;
  coutTotalActif: number;
  coutTotalResolu: number;
  dureeMoyenne: number;
  parResponsabilite: {
    client: number;
    transitaire: number;
    transporteur: number;
    autre: number;
  };
}

export interface DetentionFilters {
  statut?: string;
  responsabilite?: string;
  dateDebut?: string;
  dateFin?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface CreateDetentionData {
  sortieConteneurId: string;
  dateDebutDetention: string;
  coutParJour: number;
  responsabilite: 'client' | 'transitaire' | 'transporteur' | 'autre';
  motifDetention: string;
  observations?: string;
}

export interface UpdateDetentionData {
  dateFinDetention?: string;
  coutParJour?: number;
  responsabilite?: 'client' | 'transitaire' | 'transporteur' | 'autre';
  motifDetention?: string;
  observations?: string;
}

class DetentionService {
  /**
   * Récupérer toutes les détentions avec filtres et pagination
   */
  async getDetentions(filters: DetentionFilters = {}) {
    console.log('🔍 DetentionService.getDetentions called with filters:', filters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/detentions?${queryString}` : '/detentions';
    
    console.log('📡 Making API call to:', endpoint);
    const response = await apiService.get(endpoint);
    console.log('📦 Raw API response:', response);
    
    // Transformer les données du backend vers le format frontend
    if (response.success && response.data) {
      response.data = response.data.map((detention: any) => this.transformDetentionData(detention));
    }
    
    return response;
  }

  /**
   * Récupérer une détention spécifique
   */
  async getDetention(id: string) {
    return apiService.get(`/detentions/${id}`);
  }

  /**
   * Créer une nouvelle détention
   */
  async createDetention(data: CreateDetentionData) {
    return apiService.post('/detentions', {
      sortie_conteneur_id: data.sortieConteneurId,
      date_debut_detention: data.dateDebutDetention,
      cout_par_jour: data.coutParJour,
      responsabilite: data.responsabilite,
      motif_detention: data.motifDetention,
      observations: data.observations,
    });
  }

  /**
   * Mettre à jour une détention
   */
  async updateDetention(id: string, data: UpdateDetentionData) {
    const payload: any = {};
    
    if (data.dateFinDetention) payload.date_fin_detention = data.dateFinDetention;
    if (data.coutParJour) payload.cout_par_jour = data.coutParJour;
    if (data.responsabilite) payload.responsabilite = data.responsabilite;
    if (data.motifDetention) payload.motif_detention = data.motifDetention;
    if (data.observations) payload.observations = data.observations;

    return apiService.put(`/detentions/${id}`, payload);
  }

  /**
   * Supprimer une détention
   */
  async deleteDetention(id: string) {
    return apiService.delete(`/detentions/${id}`);
  }

  /**
   * Récupérer les détentions actives
   */
  async getActiveDetentions(filters: Omit<DetentionFilters, 'statut'> = {}) {
    return this.getDetentions({ ...filters, statut: 'active' });
  }

  /**
   * Récupérer les détentions résolues
   */
  async getResolvedDetentions(filters: Omit<DetentionFilters, 'statut'> = {}) {
    return this.getDetentions({ ...filters, statut: 'resolue' });
  }

  /**
   * Récupérer les statistiques des détentions
   */
  async getDetentionStats(filters: Pick<DetentionFilters, 'dateDebut' | 'dateFin'> = {}): Promise<DetentionStats> {
    const params = new URLSearchParams();
    
    if (filters.dateDebut) params.append('date_debut', filters.dateDebut);
    if (filters.dateFin) params.append('date_fin', filters.dateFin);

    const queryString = params.toString();
    const endpoint = queryString ? `/detentions/stats?${queryString}` : '/detentions/stats';
    
    const response = await apiService.get(endpoint);
    
    return {
      totalDetentions: response.data.total_detentions,
      detentionsActives: response.data.detentions_actives,
      detentionsResolues: response.data.detentions_resolues,
      detentionsContestees: response.data.detentions_contestees,
      coutTotalActif: response.data.cout_total_actif,
      coutTotalResolu: response.data.cout_total_resolu,
      dureeMoyenne: response.data.duree_moyenne,
      parResponsabilite: {
        client: response.data.par_responsabilite.client,
        transitaire: response.data.par_responsabilite.transitaire,
        transporteur: response.data.par_responsabilite.transporteur,
        autre: response.data.par_responsabilite.autre,
      },
    };
  }

  /**
   * Exporter les détentions
   */
  async exportDetentions(filters: DetentionFilters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/detentions/export?${queryString}` : '/detentions/export';
    
    return apiService.get(endpoint);
  }

  /**
   * Résoudre une détention
   */
  async resolveDetention(id: string, observations?: string) {
    return apiService.post(`/detentions/${id}/resolve`, {
      observations,
    });
  }

  /**
   * Contester une détention
   */
  async contestDetention(id: string, motif: string) {
    return apiService.post(`/detentions/${id}/contest`, {
      motif,
    });
  }

  /**
   * Transformer les données du backend vers le format frontend
   */
  private transformDetentionData(backendData: any): DetentionContainer {
    const sortieConteneur = backendData.sortie_conteneur || {};
    
    return {
      id: backendData.id.toString(),
      numeroConteneur: sortieConteneur.numero_conteneur || 'N/A',
      codeArmateur: sortieConteneur.code_armateur || 'N/A',
      typeConteneur: sortieConteneur.type_destination || 'Standard',
      joursBAT: parseInt(sortieConteneur.jours_bad) || 0,
      joursRealises: backendData.jours_detention || 0,
      joursDepassement: backendData.jours_detention || 0,
      dateSortie: sortieConteneur.date_sortie || '',
      dateRetour: sortieConteneur.date_retour || '',
      nomClient: sortieConteneur.nom_client || 'Client inconnu',
      responsabilite: this.mapResponsabilite(backendData.responsabilite),
      joursClient: backendData.responsabilite === 'client' ? backendData.jours_detention : 0,
      joursLogistica: backendData.responsabilite === 'transitaire' ? backendData.jours_detention : 0,
      noteDebitGeneree: backendData.statut === 'resolue',
      paiementConfirme: backendData.statut === 'resolue',
    };
  }

  /**
   * Mapper la responsabilité du backend vers le frontend
   */
  private mapResponsabilite(backendResponsabilite: string): 'client' | 'logistica' | 'partagee' | undefined {
    switch (backendResponsabilite) {
      case 'client':
        return 'client';
      case 'transitaire':
      case 'transporteur':
      case 'autre':
        return 'logistica';
      default:
        return undefined;
    }
  }
}

export const detentionService = new DetentionService();