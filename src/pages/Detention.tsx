import { useState, useEffect } from "react";
import { DetentionContainer, ResponsabiliteFormData } from "@/types/detention";
import { ResponsabiliteDialog } from "@/components/detention/ResponsabiliteDialog";
import { DetentionStats } from "@/components/detention/DetentionStats";
import { DetentionTable } from "@/components/detention/DetentionTable";
import { useDetention } from "@/hooks/useDetention";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { detentionService } from "@/services/detentionService";
import { detentionPdfService } from "@/services/detentionPdfService";

console.log('🔄 Detention.tsx file loaded');

export default function Detention() {
  console.log('🎯 Detention page component rendered');
  console.log('🌍 Current window location:', window.location.href);
  const { toast } = useToast();
  
  console.log('🔧 Initializing useDetention hook...');
  const {
    detentions,
    stats,
    loading,
    error,
    fetchDetentions,
    fetchStats,
    resolveDetention,
    contestDetention,
    exportDetentions,
  } = useDetention();

  console.log('📊 Current detention state:', { 
    detentionsCount: detentions.length, 
    stats, 
    loading, 
    error 
  });

  const [selectedContainer, setSelectedContainer] = useState<DetentionContainer | null>(null);
  const [isResponsabiliteDialogOpen, setIsResponsabiliteDialogOpen] = useState(false);
  const [isFixingMissing, setIsFixingMissing] = useState(false);

  // Test direct de l'API
  useEffect(() => {
    const testAPI = async () => {
      console.log('🧪 Testing API directly...');
      try {
        // Test avec fetch direct
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://127.0.0.1:8000/api/detentions', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        console.log('🔗 Direct API test response status:', response.status);
        const data = await response.json();
        console.log('📦 Direct API test response data:', data);
      } catch (error) {
        console.error('❌ Direct API test failed:', error);
      }
    };
    
    testAPI();
  }, []);

  const handleIdentifyResponsability = (container: DetentionContainer) => {
    setSelectedContainer(container);
    setIsResponsabiliteDialogOpen(true);
  };

  const handleConfirmResponsability = async (data: ResponsabiliteFormData) => {
    if (!selectedContainer) return;

    try {
      // Mapper la responsabilité du formulaire vers le backend
      let backendResponsabilite: 'client' | 'transitaire' | 'transporteur' | 'autre' | undefined;
      switch (data.responsabilite) {
        case 'client':
          backendResponsabilite = 'client';
          break;
        case 'logistica':
          backendResponsabilite = 'transitaire'; // côté backend: non-client
          break;
        case 'partagee':
          backendResponsabilite = 'autre';
          break;
      }

      const observations = data.responsabilite === 'partagee'
        ? `Responsabilité partagée: ${data.joursClient}j client / ${data.joursLogistica}j logistica`
        : undefined;

      // Appel API pour enregistrer la responsabilité
      await detentionService.updateDetention(selectedContainer.id, {
        responsabilite: backendResponsabilite,
        observations,
      });
      
      setIsResponsabiliteDialogOpen(false);
      setSelectedContainer(null);

      toast({
        title: "Responsabilité mise à jour",
        description: `La responsabilité pour le conteneur ${selectedContainer.numeroConteneur} a été définie.`,
      });

      // Recharger les données
      await fetchDetentions();
      await fetchStats();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la responsabilité.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = async (container: DetentionContainer) => {
    try {
      // Générer le PDF moderne directement côté client
      detentionPdfService.generateDebitNote(container);
      
      toast({
        title: "PDF généré",
        description: `Note de débit pour ${container.numeroConteneur} générée avec succès.`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmPayment = async (container: DetentionContainer) => {
    try {
      // Marquer comme résolu dans l'API
      await resolveDetention(container.id, 'Paiement confirmé');
      
      toast({
        title: "Paiement confirmé",
        description: `Le paiement pour ${container.numeroConteneur} a été confirmé.`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de confirmer le paiement.",
        variant: "destructive",
      });
    }
  };

  const handleFixMissingDetentions = async () => {
    console.log('🔧 Fixing missing detentions...')
    setIsFixingMissing(true)
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/detentions/fix-missing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
        },
      })

      const result = await response.json()
      console.log('🔧 Fix missing detentions result:', result)

      if (result.success) {
        toast({
          title: "Détentions créées",
          description: `${result.data.total_created} détention(s) créée(s) avec succès`,
        })
        // Recharger les données
        fetchDetentions()
        fetchStats()
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message || "Erreur lors de la création des détentions",
        })
      }
    } catch (error) {
      console.error('❌ Error fixing missing detentions:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la création des détentions manquantes",
      })
    } finally {
      setIsFixingMissing(false)
    }
  };

  console.log('🎯 Detention page rendering with:', { 
    detentionsCount: detentions.length, 
    detentions, 
    loading, 
    stats 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détention</h1>
          <p className="text-muted-foreground">
            Gestion des conteneurs ayant dépassé leur franchise
          </p>
        </div>
        <Button 
          onClick={handleFixMissingDetentions}
          disabled={isFixingMissing}
          variant="outline"
          className="ml-4"
        >
          {isFixingMissing ? "Création..." : "Créer détentions manquantes"}
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

      <ResponsabiliteDialog
        isOpen={isResponsabiliteDialogOpen}
        onOpenChange={setIsResponsabiliteDialogOpen}
        selectedContainer={selectedContainer}
        onConfirm={handleConfirmResponsability}
      />
    </div>
  );
}