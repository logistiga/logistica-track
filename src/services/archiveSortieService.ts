import { apiService } from './apiService';
import type { ArchiveSortie } from '@/types/archivesSortie';

class ArchiveSortieService {
  // Récupérer toutes les archives de sorties
  async getArchivesSortie(): Promise<ArchiveSortie[]> {
    try {
      const response = await apiService.get('/sorties/archives');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des archives sorties:', error);
      return [];
    }
  }

  // Rechercher des archives de sorties avec filtres
  async searchArchivesSortie(params: any): Promise<ArchiveSortie[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/sorties/archives/search?${queryString}`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'archives sorties:', error);
      return [];
    }
  }

  // Récupérer une archive de sortie spécifique
  async getArchiveSortie(id: string): Promise<ArchiveSortie | null> {
    try {
      const response = await apiService.get(`/sorties/archives/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'archive sortie:', error);
      return null;
    }
  }

  // Exporter des archives de sorties
  async exportArchivesSortie(format: string, filters?: any): Promise<Blob> {
    try {
      const params = { format, ...filters };
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/sorties/archives/export?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des archives sorties
  async getArchivesSortieStats(filters?: any): Promise<any> {
    try {
      const queryString = filters ? new URLSearchParams(filters).toString() : '';
      const response = await apiService.get(`/sorties/archives/stats?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_archives: 0,
        total_detention: 0,
        total_paye: 0,
        total_sans_frais: 0
      };
    }
  }
}

export const archiveSortieService = new ArchiveSortieService();
