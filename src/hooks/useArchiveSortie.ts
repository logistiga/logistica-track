import { useState, useEffect } from 'react';
import { archiveSortieService } from '@/services/archiveSortieService';
import type { ArchiveSortie, ArchiveSortieFilters } from '@/types/archivesSortie';
import { useToast } from '@/hooks/use-toast';

export function useArchiveSortie() {
  const { toast } = useToast();
  const [archives, setArchives] = useState<ArchiveSortie[]>([]);
  const [loading, setLoading] = useState(false);

  const loadArchivesSortie = async () => {
    setLoading(true);
    try {
      const data = await archiveSortieService.getArchivesSortie();
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors du chargement des archives sorties:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les archives de sorties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchArchivesSortie = async (filters: ArchiveSortieFilters) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.dateDebut) params.date_debut = filters.dateDebut;
      if (filters.dateFin) params.date_fin = filters.dateFin;
      if (filters.armateur !== 'all') params.armateur = filters.armateur;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.numeroConteneur) params.numero_conteneur = filters.numeroConteneur;
      if (filters.statutPaiement !== 'all') params.statut_paiement = filters.statutPaiement;

      const data = await archiveSortieService.searchArchivesSortie(params);
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les archives de sorties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportArchivesSortie = async (format: string, filters?: ArchiveSortieFilters) => {
    try {
      await archiveSortieService.exportArchivesSortie(format, filters);
      toast({
        title: "Export en cours",
        description: `Génération du fichier ${format.toUpperCase()}...`
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les archives de sorties",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadArchivesSortie();
  }, []);

  return {
    archives,
    loading,
    loadArchivesSortie,
    searchArchivesSortie,
    exportArchivesSortie
  };
}
