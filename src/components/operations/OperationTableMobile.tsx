import { Operation } from "@/types/operations";
import { CompactCard } from "@/components/shared/CompactCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Trash2, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface OperationTableMobileProps {
  operations: Operation[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (operation: Operation) => void;
}

export function OperationTableMobile({
  operations,
  onStart,
  onComplete,
  onDelete,
  onView
}: OperationTableMobileProps) {
  if (operations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune opération trouvée.
      </div>
    );
  }

  const getOperationTypeLabel = (type: Operation['typeOperation']) => {
    const labels = {
      'location': 'Location',
      'transport': 'Transport',
      'double-relevage': 'Double relevage',
      'logistique': 'Logistique'
    };
    return labels[type] || type;
  };

  const getStatusVariant = (statut: Operation['statut']) => {
    const variants = {
      'en-attente': 'outline' as const,
      'en-cours': 'default' as const,
      'terminee': 'secondary' as const,
      'confirmee': 'secondary' as const
    };
    return variants[statut] || 'outline' as const;
  };

  const getStatusLabel = (statut: Operation['statut']) => {
    const labels = {
      'en-attente': 'En attente',
      'en-cours': 'En cours',
      'terminee': 'Terminée',
      'confirmee': 'Confirmée'
    };
    return labels[statut] || statut;
  };

  return (
    <div className="space-y-3">
      {operations.map((operation) => {
        const fields: Array<{label: string; value: any; priority: 'high' | 'medium' | 'low'; badge?: boolean}> = [
          {
            label: "Type",
            value: <Badge variant="outline">{getOperationTypeLabel(operation.typeOperation)}</Badge>,
            priority: "high"
          },
          {
            label: "Client",
            value: operation.client,
            priority: "high"
          }
        ];

        // Ajouter des champs selon le type d'opération
        if (operation.typeOperation === 'location') {
          if (operation.dateDebut) {
            fields.push({
              label: "Début",
              value: new Date(operation.dateDebut).toLocaleDateString('fr-FR'),
              priority: "medium"
            });
          }
          if (operation.dateFin) {
            fields.push({
              label: "Fin",
              value: new Date(operation.dateFin).toLocaleDateString('fr-FR'),
              priority: "medium"
            });
          }
          if (operation.duree) {
            fields.push({
              label: "Durée",
              value: `${operation.duree} jours`,
              priority: "medium"
            });
          }
        }

        if (operation.typeOperation === 'transport') {
          if (operation.lieuDepart) {
            fields.push({
              label: "Départ",
              value: operation.lieuDepart,
              priority: "medium"
            });
          }
          if (operation.destination) {
            fields.push({
              label: "Destination",
              value: operation.destination,
              priority: "medium"
            });
          }
        }

        fields.push(
          {
            label: "Camion",
            value: operation.camion || "N/A",
            priority: "low"
          },
          {
            label: "Remorque",
            value: operation.remorque || "N/A",
            priority: "low"
          },
          {
            label: "Montant",
            value: formatCurrency(operation.montant),
            priority: "high"
          }
        );

        const actions = (
          <div className="flex gap-2 flex-wrap">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(operation);
                }}
                className="flex-1 min-w-[80px]"
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
            )}
            {operation.statut === 'en-attente' && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStart(operation.id);
                }}
                className="flex-1 min-w-[100px]"
              >
                <Play className="h-4 w-4 mr-1" />
                Démarrer
              </Button>
            )}
            {operation.statut === 'en-cours' && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(operation.id);
                }}
                className="flex-1 min-w-[100px]"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Terminer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(operation.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );

        return (
          <CompactCard
            key={operation.id}
            title={`OP-${operation.id.substring(0, 6)}`}
            subtitle={operation.client}
            fields={fields}
            actions={actions}
            status={{
              label: getStatusLabel(operation.statut),
              variant: getStatusVariant(operation.statut)
            }}
          />
        );
      })}
    </div>
  );
}
