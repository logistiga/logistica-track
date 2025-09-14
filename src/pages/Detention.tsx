import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDetention } from '@/hooks/useDetention';
import { DetentionStats } from '@/components/detention/DetentionStats';
import { DetentionTable } from '@/components/detention/DetentionTable';
import { ResponsabiliteDialog } from '@/components/detention/ResponsabiliteDialog';
import { DetentionContainer, ResponsabiliteFormData } from '@/types/detention';
import { detentionPdfService } from '@/services/detentionPdfService';
import { apiService } from '@/services/apiService';

export default function Detention() {
  const [isResponsabiliteDialogOpen, setIsResponsabiliteDialogOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<DetentionContainer | null>(null);
  const [isFixingMissing, setIsFixingMissing] = useState(false);

  const { detentions, stats, loading, fetchDetentions, fetchStats, resolveDetention } = useDetention();
  const { toast } = useToast();

  const handleIdentifyResponsability = (container: DetentionContainer) => {
    setSelectedContainer(container);
    setIsResponsabiliteDialogOpen(true);
  };

  const handleConfirmResponsability = async (data: ResponsabiliteFormData) => {
    if (!selectedContainer) return;

    try {
      const response = await apiService.put(`/detentions/${selectedContainer.id}`, {
        responsabilite: data.responsabilite,
        jours_client: data.joursClient,
        jours_logistiga: data.joursLogistiga,
      });

      if (response.success) {
        toast({ title: 'Responsabilité définie', description: 'La responsabilité a été mise à jour avec succès.' });
        setIsResponsabiliteDialogOpen(false);
        setSelectedContainer(null);
        await Promise.all([fetchDetentions(), fetchStats()]);
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour la responsabilité.', variant: 'destructive' });
    }
  };

  const handleGeneratePDF = (container: DetentionContainer) => {
    try {
      detentionPdfService.generateDebitNote(container);
      toast({ title: 'PDF généré', description: 'La note de débit a été générée avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de générer le PDF.', variant: 'destructive' });
    }
  };

  const handleConfirmPayment = async (container: DetentionContainer) => {
    await resolveDetention(container.id, 'Paiement confirmé');
  };

  const handleFixMissingDetentions = async () => {
    try {
      setIsFixingMissing(true);
      const response = await apiService.post('/detentions/fix-missing', {});
      
      if (response.success) {
        toast({ title: 'Détentions créées', description: `${response.data.created_count} nouvelles détentions ont été créées.` });
        await Promise.all([fetchDetentions(), fetchStats()]);
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de créer les détentions manquantes.', variant: 'destructive' });
    } finally {
      setIsFixingMissing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Détentions</h1>
          <p className="text-muted-foreground">Suivi et gestion des conteneurs en dépassement de délai</p>
        </div>
        <Button onClick={handleFixMissingDetentions} disabled={isFixingMissing} variant="outline">
          {isFixingMissing ? 'Création en cours...' : 'Créer détentions manquantes'}
        </Button>
      </div>

      <DetentionStats stats={stats} loading={loading} />
      <DetentionTable
        containers={detentions}
        loading={loading}
        onIdentifyResponsability={handleIdentifyResponsability}
        onGeneratePDF={handleGeneratePDF}
        onConfirmPayment={handleConfirmPayment}
      />

      {selectedContainer && (
        <ResponsabiliteDialog
          isOpen={isResponsabiliteDialogOpen}
          onOpenChange={(open) => { 
            setIsResponsabiliteDialogOpen(open); 
            if (!open) setSelectedContainer(null); 
          }}
          selectedContainer={selectedContainer}
          onConfirm={handleConfirmResponsability}
        />
      )}
    </div>
  );
}