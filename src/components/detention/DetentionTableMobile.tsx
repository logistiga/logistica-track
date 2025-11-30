import { DetentionContainer } from "@/types/detention";
import { CompactCard } from "@/components/shared/CompactCard";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface DetentionTableMobileProps {
  detentions: DetentionContainer[];
  onView: (detention: DetentionContainer) => void;
  onGeneratePDF: (detention: DetentionContainer) => void;
  onMarkAsPaid: (detention: DetentionContainer) => void;
}

export function DetentionTableMobile({
  detentions,
  onView,
  onGeneratePDF,
  onMarkAsPaid
}: DetentionTableMobileProps) {
  if (detentions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune détention trouvée.
      </div>
    );
  }

  const getResponsabiliteLabel = (resp?: string) => {
    if (!resp) return 'Non définie';
    const labels: Record<string, string> = {
      'client': 'Client',
      'logistiga': 'Logistiga',
      'partagee': 'Partagée'
    };
    return labels[resp] || resp;
  };

  return (
    <div className="space-y-3">
      {detentions.map((detention) => {
        const fields: Array<{label: string; value: any; priority: 'high' | 'medium' | 'low'}> = [
          {
            label: "Armateur",
            value: detention.codeArmateur,
            priority: "high"
          },
          {
            label: "Jours dépassement",
            value: `${detention.joursDepassement} jours`,
            priority: "high"
          },
          {
            label: "Montant total",
            value: formatCurrency(detention.montantTotal),
            priority: "high"
          },
          {
            label: "Client",
            value: detention.nomClient,
            priority: "medium"
          },
          {
            label: "Date sortie",
            value: new Date(detention.dateSortie).toLocaleDateString('fr-FR'),
            priority: "low"
          }
        ];

        const actions = (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(detention);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {detention.responsabilite && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGeneratePDF(detention);
                }}
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

        return (
          <CompactCard
            key={detention.id}
            title={detention.numeroConteneur}
            subtitle={`Dépassement: ${detention.joursDepassement} jours`}
            fields={fields}
            actions={actions}
            status={{
              label: getResponsabiliteLabel(detention.responsabilite),
              variant: detention.responsabilite ? 'default' : 'outline'
            }}
          />
        );
      })}
    </div>
  );
}
