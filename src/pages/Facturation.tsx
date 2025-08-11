import { useState } from "react";
import { FactureInterne } from "@/types/facturation";
import { FacturationStats } from "@/components/facturation/FacturationStats";
import { FacturationTable } from "@/components/facturation/FacturationTable";
import { useToast } from "@/hooks/use-toast";

export default function Facturation() {
  const { toast } = useToast();
  const [factures, setFactures] = useState<FactureInterne[]>([
    {
      id: "1",
      numeroFacture: "FACT-2024-001",
      dateFacture: "2024-01-15",
      typeOperation: "stockage",
      numeroConteneur: "CONT001",
      nomClient: "Client ABC",
      montantAPayer: 350.00,
      dateSortieOperation: "2024-01-15",
      statutPaiement: "en-attente",
      joursGratuits: 5,
      joursPayants: 3,
      tarifJournalier: 116.67
    },
    {
      id: "2",
      numeroFacture: "FACT-2024-002",
      dateFacture: "2024-01-16",
      typeOperation: "double-relevage",
      numeroConteneur: "CONT002",
      nomClient: "Client XYZ",
      montantAPayer: 250.00,
      dateSortieOperation: "2024-01-16",
      statutPaiement: "en-attente"
    },
    {
      id: "3",
      numeroFacture: "FACT-2024-003",
      dateFacture: "2024-01-14",
      typeOperation: "stockage",
      numeroConteneur: "CONT003",
      nomClient: "Client DEF",
      montantAPayer: 180.00,
      dateSortieOperation: "2024-01-14",
      statutPaiement: "paye",
      joursGratuits: 7,
      joursPayants: 2,
      tarifJournalier: 90.00
    }
  ]);

  const handleGeneratePDF = (facture: FactureInterne) => {
    toast({
      title: "PDF généré",
      description: `Facture ${facture.numeroFacture} générée avec succès`
    });
  };

  const handleConfirmPayment = (facture: FactureInterne) => {
    setFactures(prev => prev.filter(f => f.id !== facture.id));
    toast({
      title: "Paiement confirmé",
      description: `La facture ${facture.numeroFacture} a été transférée aux archives.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">
          Gestion des factures internes pour les opérations de base
        </p>
      </div>

      <FacturationStats factures={factures} />

      <FacturationTable
        factures={factures}
        onGeneratePDF={handleGeneratePDF}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}