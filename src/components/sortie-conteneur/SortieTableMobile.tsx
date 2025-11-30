import { SortieConteneur } from "@/types/sortie-conteneur";
import { CompactCard } from "@/components/shared/CompactCard";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Edit, Trash2, CheckCircle, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface SortieTableMobileProps {
  sorties: SortieConteneur[];
  onEdit: (sortie: SortieConteneur) => void;
  onDelete: (sortie: SortieConteneur) => void;
  onReturn: (sortie: SortieConteneur) => void;
  onView?: (sortie: SortieConteneur) => void;
  showReturnAction?: boolean;
}

export function SortieTableMobile({
  sorties,
  onEdit,
  onDelete,
  onReturn,
  onView,
  showReturnAction = true
}: SortieTableMobileProps) {
  if (sorties.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune sortie de conteneur trouvée.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorties.map((sortie) => {
        const fields = [
          {
            label: "BL",
            value: sortie.numeroBL || "N/A",
            priority: "high" as const
          },
          {
            label: "Armateur",
            value: sortie.codeArmateur,
            priority: "high" as const
          },
          {
            label: "Client",
            value: sortie.nomClient,
            priority: "high" as const
          },
          {
            label: "Date sortie",
            value: new Date(sortie.dateSortie).toLocaleDateString('fr-FR'),
            priority: "medium" as const
          },
          {
            label: "Destination",
            value: sortie.destination === "base" ? "Base" : "Client",
            priority: "medium" as const,
            badge: true
          },
          {
            label: "Camion",
            value: sortie.camion || "N/A",
            priority: "low" as const
          },
          {
            label: "Remorque",
            value: sortie.remorque || "N/A",
            priority: "low" as const
          }
        ];

        if (sortie.primeChauffeur) {
          fields.push({
            label: "Prime",
            value: formatCurrency(sortie.primeChauffeur),
            priority: "medium" as const
          });
        }

        const actions = (
          <div className="flex gap-2 flex-wrap">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(sortie);
                }}
                className="flex-1 min-w-[80px]"
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
            )}
            {showReturnAction && sortie.statut === "en_cours" && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReturn(sortie);
                }}
                className="flex-1 min-w-[100px]"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Retour
              </Button>
            )}
            {sortie.statut !== "retourne_port" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(sortie);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sortie);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );

        return (
          <CompactCard
            key={sortie.id}
            title={sortie.numeroConteneur}
            subtitle={`BL: ${sortie.numeroBL || 'N/A'}`}
            fields={fields}
            actions={actions}
            status={{
              label: sortie.statut === "en_cours" ? "En cours" :
                     sortie.statut === "a_la_base" ? "À la base" :
                     sortie.statut === "livre_client" ? "Livré" :
                     "Retourné",
              variant: sortie.statut === "en_cours" ? "default" :
                      sortie.statut === "retourne_port" ? "secondary" : "outline"
            }}
          />
        );
      })}
    </div>
  );
}
