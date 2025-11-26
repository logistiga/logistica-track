import { useState, useEffect } from 'react';
import { archiveOperationService } from '@/services/archiveOperationService';
import type { ArchiveOperation, ArchiveOperationFilters } from '@/types/archivesOperation';
import { useToast } from '@/hooks/use-toast';

export function useArchiveOperation() {
  const { toast } = useToast();
  const [archives, setArchives] = useState<ArchiveOperation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadArchivesOperation = async () => {
    setLoading(true);
    try {
      const data = await archiveOperationService.getArchivesOperation();
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors du chargement des archives opérations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les archives d'opérations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchArchivesOperation = async (filters: ArchiveOperationFilters) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.dateDebut) params.date_debut = filters.dateDebut;
      if (filters.dateFin) params.date_fin = filters.dateFin;
      if (filters.typeOperation !== 'all') params.type_operation = filters.typeOperation;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.numeroOperation) params.numero_operation = filters.numeroOperation;
      if (filters.statutPaiement !== 'all') params.statut_paiement = filters.statutPaiement;

      const data = await archiveOperationService.searchArchivesOperation(params);
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les archives d'opérations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportArchivesOperation = async (format: string, filters?: ArchiveOperationFilters) => {
    try {
      await archiveOperationService.exportArchivesOperation(format, filters);
      toast({
        title: "Export en cours",
        description: `Génération du fichier ${format.toUpperCase()}...`
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les archives d'opérations",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadArchivesOperation();
  }, []);

  return {
    archives,
    loading,
    loadArchivesOperation,
    searchArchivesOperation,
    exportArchivesOperation
  };
}
