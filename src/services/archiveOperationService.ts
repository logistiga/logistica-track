import { apiService } from './apiService';
import type { ArchiveOperation } from '@/types/archivesOperation';

class ArchiveOperationService {
  // Récupérer toutes les archives d'opérations
  async getArchivesOperation(): Promise<ArchiveOperation[]> {
    try {
      const response = await apiService.get('/operations/archives');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des archives opérations:', error);
      return [];
    }
  }

  // Rechercher des archives d'opérations avec filtres
  async searchArchivesOperation(params: any): Promise<ArchiveOperation[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/operations/archives/search?${queryString}`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'archives opérations:', error);
      return [];
    }
  }

  // Récupérer une archive d'opération spécifique
  async getArchiveOperation(id: string): Promise<ArchiveOperation | null> {
    try {
      const response = await apiService.get(`/operations/archives/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'archive opération:', error);
      return null;
    }
  }

  // Exporter des archives d'opérations
  async exportArchivesOperation(format: string, filters?: any): Promise<Blob> {
    try {
      const params = { format, ...filters };
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/operations/archives/export?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des archives opérations
  async getArchivesOperationStats(filters?: any): Promise<any> {
    try {
      const queryString = filters ? new URLSearchParams(filters).toString() : '';
      const response = await apiService.get(`/operations/archives/stats?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_archives: 0,
        total_montant: 0,
        par_type: {}
      };
    }
  }
}

export const archiveOperationService = new ArchiveOperationService();
