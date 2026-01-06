import { calculateDateLimite, formatDateLimiteShort } from "@/utils/detentionCalculations";

interface ArmateurConditionsProps {
  armateur: {
    code: string;
    jours_gratuits: number;
    prix_par_jour: number;
  };
  dateSortie: Date;
  dateFinFranchise?: string;
}

export function ArmateurConditions({ armateur, dateSortie, dateFinFranchise }: ArmateurConditionsProps) {
  const dateLimite = calculateDateLimite(dateSortie, armateur.jours_gratuits, dateFinFranchise);
  
  return (
    <div className="p-2 bg-muted rounded border space-y-2">
      <h4 className="text-sm font-medium">Conditions de détention - {armateur.code}</h4>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-background rounded text-xs">
          <div className="text-lg font-bold text-primary">{armateur.jours_gratuits}</div>
          <div className="text-xs text-muted-foreground">Jours gratuits</div>
        </div>
        <div className="text-center p-2 bg-background rounded text-xs">
          <div className="text-lg font-bold text-destructive">{armateur.prix_par_jour.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">FCFA / jour</div>
        </div>
        <div className="text-center p-2 bg-background rounded text-xs">
          <div className="text-lg font-bold text-orange-600">
            {formatDateLimiteShort(dateLimite)}
          </div>
          <div className="text-xs text-muted-foreground">Date limite retour</div>
        </div>
      </div>
    </div>
  );
}
