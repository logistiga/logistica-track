import { apiService } from './apiService';
import type { ArchiveBase } from '@/types/archives';

class ArchiveService {
  // Récupérer toutes les archives
  async getArchives(): Promise<ArchiveBase[]> {
    try {
      const response = await apiService.get('/archives');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des archives:', error);
      return [];
    }
  }

  // Rechercher des archives avec filtres
  async searchArchives(params: any): Promise<ArchiveBase[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/archives/search?${queryString}`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'archives:', error);
      return [];
    }
  }

  // Récupérer une archive spécifique
  async getArchive(id: string): Promise<ArchiveBase | null> {
    try {
      const response = await apiService.get(`/archives/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'archive:', error);
      return null;
    }
  }

  // Exporter des archives
  async exportArchives(format: string, filters?: any): Promise<Blob> {
    try {
      const params = { format, ...filters };
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/archives/export?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  }

  // Restaurer une archive
  async restoreArchive(id: string): Promise<any> {
    try {
      const response = await apiService.post(`/archives/restore/${id}`, {});
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      throw error;
    }
  }

  // Supprimer une archive
  async deleteArchive(id: string): Promise<void> {
    try {
      await apiService.delete(`/archives/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }
}

export const archiveService = new ArchiveService();
