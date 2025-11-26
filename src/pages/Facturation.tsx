import { FactureInterne } from "@/types/facturation";
import { FacturationStats } from "@/components/facturation/FacturationStats";
import { FacturationTable } from "@/components/facturation/FacturationTable";
import { useFacturation } from "@/hooks/useFacturation";

export default function Facturation() {
  const {
    factures,
    loading,
    stats,
    generatePDF,
    markAsPaid,
  } = useFacturation();

  const handleGeneratePDF = (facture: FactureInterne) => {
    generatePDF(facture);
  };

  const handleConfirmPayment = (facture: FactureInterne) => {
    markAsPaid(facture.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">
          Gestion des factures internes pour les opérations de base
        </p>
      </div>

      <FacturationStats stats={stats} />

      <FacturationTable
        factures={factures}
        loading={loading}
        onGeneratePDF={handleGeneratePDF}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}