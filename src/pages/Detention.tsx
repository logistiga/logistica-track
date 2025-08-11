import { useState } from "react";
import { DetentionContainer } from "@/types/detention";
import { ResponsabiliteDialog } from "@/components/detention/ResponsabiliteDialog";
import { DetentionStats } from "@/components/detention/DetentionStats";
import { DetentionTable } from "@/components/detention/DetentionTable";
import { useToast } from "@/hooks/use-toast";

export default function Detention() {
  const { toast } = useToast();
  const [containers, setContainers] = useState<DetentionContainer[]>([
    {
      id: "1",
      numeroConteneur: "CONT001",
      codeArmateur: "MSC",
      typeConteneur: "20' DRY",
      joursBAT: 5,
      joursRealises: 8,
      joursDepassement: 3,
      dateSortie: "2024-01-15",
      dateRetour: "2024-01-23",
      nomClient: "Client ABC",
      noteDebitGeneree: true,
      paiementConfirme: false
    },
    {
      id: "2",
      numeroConteneur: "CONT002",
      codeArmateur: "CMA",
      typeConteneur: "40' HC",
      joursBAT: 7,
      joursRealises: 12,
      joursDepassement: 5,
      dateSortie: "2024-01-10",
      dateRetour: "2024-01-22",
      nomClient: "Client XYZ",
      noteDebitGeneree: true,
      paiementConfirme: false
    }
  ]);

  const [selectedContainer, setSelectedContainer] = useState<DetentionContainer | null>(null);
  const [isResponsabiliteDialogOpen, setIsResponsabiliteDialogOpen] = useState(false);

  const handleIdentifyResponsability = (container: DetentionContainer) => {
    setSelectedContainer(container);
    setIsResponsabiliteDialogOpen(true);
  };

  const handleConfirmResponsability = (data: any) => {
    if (!selectedContainer) return;

    setContainers(prev => prev.map(container =>
      container.id === selectedContainer.id
        ? {
            ...container,
            responsabilite: data.responsabilite,
            joursClient: data.joursClient,
            joursLogistica: data.joursLogistica
          }
        : container
    ));

    toast({
      title: "Responsabilité identifiée",
      description: "La responsabilité a été assignée avec succès."
    });

    setIsResponsabiliteDialogOpen(false);
    setSelectedContainer(null);
  };

  const handleGeneratePDF = (container: DetentionContainer) => {
    toast({
      title: "PDF généré",
      description: `Note de débit générée pour le conteneur ${container.numeroConteneur}`
    });
  };

  const handleConfirmPayment = (container: DetentionContainer) => {
    setContainers(prev => prev.filter(c => c.id !== container.id));
    toast({
      title: "Paiement confirmé",
      description: `Le conteneur ${container.numeroConteneur} a été transféré aux archives.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Détention</h1>
        <p className="text-muted-foreground">
          Gestion des conteneurs ayant dépassé leur franchise
        </p>
      </div>

      <DetentionStats containers={containers} />

      <DetentionTable
        containers={containers}
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