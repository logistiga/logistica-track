import { useState, useEffect } from 'react';
import { facturationService } from '@/services/facturationService';
import { facturationPdfService } from '@/services/facturationPdfService';
import { FactureInterne, CreateFactureData } from '@/types/facturation';
import { useToast } from '@/hooks/use-toast';

export function useFacturation() {
  const [factures, setFactures] = useState<FactureInterne[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBrouillons: 0,
    totalEnvoyees: 0,
    totalPayees: 0,
    montantTotal: 0,
    montantEnAttente: 0,
  });
  const { toast } = useToast();

  const fetchFacturations = async (filters?: {
    statut?: string;
    dateDebut?: string;
    dateFin?: string;
  }) => {
    setLoading(true);
    try {
      const data = await facturationService.getFacturations(filters);
      setFactures(data);
      console.log('✅ Facturations loaded successfully:', data.length, 'items');
    } catch (error: any) {
      console.error('❌ Error loading facturations:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du chargement des facturations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await facturationService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('❌ Error loading facturation stats:', error);
    }
  };

  const createFacturation = async (data: CreateFactureData) => {
    try {
      const newFacture = await facturationService.createFacturation(data);
      setFactures(prev => [newFacture, ...prev]);
      toast({
        title: 'Succès',
        description: 'Facturation créée avec succès',
      });
      await fetchStats();
      return newFacture;
    } catch (error: any) {
      console.error('❌ Error creating facturation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la création de la facturation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateFacturation = async (id: string, data: Partial<CreateFactureData>) => {
    try {
      const updated = await facturationService.updateFacturation(id, data);
      setFactures(prev => prev.map(f => f.id === id ? updated : f));
      toast({
        title: 'Succès',
        description: 'Facturation mise à jour avec succès',
      });
      await fetchStats();
      return updated;
    } catch (error: any) {
      console.error('❌ Error updating facturation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la mise à jour de la facturation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteFacturation = async (id: string) => {
    try {
      await facturationService.deleteFacturation(id);
      setFactures(prev => prev.filter(f => f.id !== id));
      toast({
        title: 'Succès',
        description: 'Facturation supprimée avec succès',
      });
      await fetchStats();
    } catch (error: any) {
      console.error('❌ Error deleting facturation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression de la facturation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const sendFacturation = async (id: string) => {
    try {
      const updated = await facturationService.sendFacturation(id);
      setFactures(prev => prev.map(f => f.id === id ? updated : f));
      toast({
        title: 'Succès',
        description: 'Facturation envoyée avec succès',
      });
      await fetchStats();
      return updated;
    } catch (error: any) {
      console.error('❌ Error sending facturation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de l\'envoi de la facturation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const updated = await facturationService.markAsPaid(id);
      setFactures(prev => prev.filter(f => f.id !== id));
      toast({
        title: 'Paiement confirmé',
        description: 'La facture a été transférée aux archives',
      });
      await fetchStats();
      return updated;
    } catch (error: any) {
      console.error('❌ Error marking as paid:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la confirmation du paiement',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const generatePDF = async (facture: FactureInterne) => {
    try {
      console.log('📄 Generating PDF for facture:', facture);
      
      // Utiliser le service PDF local pour générer et télécharger le PDF
      facturationPdfService.generateFacturePdf(facture);
      
      toast({
        title: 'PDF généré',
        description: `Facture ${facture.numeroFacture} générée avec succès`,
      });
    } catch (error: any) {
      console.error('❌ Error generating PDF:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la génération du PDF',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFacturations();
    fetchStats();
  }, []);

  return {
    factures,
    loading,
    stats,
    fetchFacturations,
    createFacturation,
    updateFacturation,
    deleteFacturation,
    sendFacturation,
    markAsPaid,
    generatePDF,
  };
}
