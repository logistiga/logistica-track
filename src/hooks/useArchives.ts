import { useState, useEffect } from 'react';
import { archiveService } from '@/services/archiveService';
import type { ArchiveBase, ArchiveFilters } from '@/types/archives';
import { useToast } from '@/hooks/use-toast';

export function useArchives() {
  const { toast } = useToast();
  const [archives, setArchives] = useState<ArchiveBase[]>([]);
  const [loading, setLoading] = useState(false);

  const loadArchives = async () => {
    setLoading(true);
    try {
      const data = await archiveService.getArchives();
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors du chargement des archives:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les archives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchArchives = async (filters: ArchiveFilters) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.dateDebut) params.date_debut = filters.dateDebut;
      if (filters.dateFin) params.date_fin = filters.dateFin;
      if (filters.typeOperation !== 'all') params.type_operation = filters.typeOperation;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.numeroConteneur) params.numero_conteneur = filters.numeroConteneur;
      if (filters.statutPaiement !== 'all') params.statut_paiement = filters.statutPaiement;

      const data = await archiveService.searchArchives(params);
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les archives",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportArchives = async (format: string, filters?: ArchiveFilters) => {
    try {
      await archiveService.exportArchives(format, filters);
      toast({
        title: "Export en cours",
        description: `Génération du fichier ${format.toUpperCase()}...`
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les archives",
        variant: "destructive"
      });
    }
  };

  const restoreArchive = async (id: string) => {
    try {
      await archiveService.restoreArchive(id);
      await loadArchives();
      toast({
        title: "Succès",
        description: "Archive restaurée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de restaurer l'archive",
        variant: "destructive"
      });
    }
  };

  const deleteArchive = async (id: string) => {
    try {
      await archiveService.deleteArchive(id);
      await loadArchives();
      toast({
        title: "Succès",
        description: "Archive supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'archive",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadArchives();
  }, []);

  return {
    archives,
    loading,
    loadArchives,
    searchArchives,
    exportArchives,
    restoreArchive,
    deleteArchive
  };
}
