import { SortieFormData } from "@/types/sortie-conteneur";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Clock } from "lucide-react";

interface CostSummaryProps {
  formData: SortieFormData;
  joursCalcules: number;
}

const TAUX_DETENTION_PAR_JOUR = 15000; // XOF par jour
const TAUX_BAD_PAR_JOUR = 12000; // XOF par jour

export function CostSummary({ formData, joursCalcules }: CostSummaryProps) {
  if (!formData.typeDestination) return null;

  const calculateCost = () => {
    if (formData.typeDestination === "bad") {
      const jours = parseInt(formData.joursBAD) || joursCalcules || 0;
      return {
        jours,
        tauxParJour: TAUX_BAD_PAR_JOUR,
        totalEstime: jours * TAUX_BAD_PAR_JOUR,
        type: "BAD"
      };
    } else if (formData.typeDestination === "detention") {
      const jours = joursCalcules || parseInt(formData.joursBAD) || 0;
      return {
        jours,
        tauxParJour: TAUX_DETENTION_PAR_JOUR,
        totalEstime: jours * TAUX_DETENTION_PAR_JOUR,
        type: "Détention"
      };
    }
    return null;
  };

  const costInfo = calculateCost();

  if (!costInfo || costInfo.jours === 0) return null;

  return (
    <Card className="bg-accent/50 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Récapitulatif des coûts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{costInfo.type}</Badge>
            <span className="text-sm text-muted-foreground">Type de facturation</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{costInfo.jours} jours</p>
              <p className="text-xs text-muted-foreground">Durée estimée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                }).format(costInfo.tauxParJour)}
              </p>
              <p className="text-xs text-muted-foreground">Par jour</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-primary">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                }).format(costInfo.totalEstime)}
              </p>
              <p className="text-xs text-muted-foreground">Total estimé</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            * Estimation basée sur les tarifs standards. Le montant final peut varier selon les conditions spécifiques.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}