import { Badge } from "@/components/ui/badge";
import { useArmateurs } from "@/hooks/useArmateurs";
import { format, addDays, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Calendar, AlertTriangle } from "lucide-react";

interface DetentionStatusButtonProps {
  armateurCode: string;
  dateSortie: string;
  typeDestination?: string;
}

export function DetentionStatusButton({ 
  armateurCode, 
  dateSortie, 
  typeDestination 
}: DetentionStatusButtonProps) {
  const { getArmateurByCode } = useArmateurs();
  
  const armateur = getArmateurByCode(armateurCode);
  
  // Ne pas afficher si pas d'armateur
  if (!armateur) {
    return null;
  }

  const sortieDate = new Date(dateSortie);
  const dateLimite = addDays(sortieDate, armateur.jours_gratuits);
  const today = new Date();
  const joursRestants = differenceInDays(dateLimite, today);

  // Déterminer le variant et l'icône selon les jours restants
  let variant: "default" | "destructive" | "outline" | "secondary" = "default";
  let icon = <Clock className="w-3 h-3" />;
  let text = "";
  let bgColor = "";

  if (typeDestination === "detention") {
    if (joursRestants < 0) {
      // Retard - Rouge
      variant = "destructive";
      icon = <AlertTriangle className="w-3 h-3" />;
      text = `${Math.abs(joursRestants)}j retard`;
      bgColor = "bg-red-500 hover:bg-red-600";
    } else if (joursRestants <= 2) {
      // Urgent - Orange  
      variant = "outline";
      icon = <Calendar className="w-3 h-3" />;
      text = joursRestants === 0 ? "Dernier jour" : `${joursRestants}j restants`;
      bgColor = "bg-orange-500 hover:bg-orange-600 text-white border-orange-500";
    } else {
      // OK - Vert
      variant = "outline";
      icon = <Clock className="w-3 h-3" />;
      text = `${joursRestants}j restants`;
      bgColor = "bg-green-500 hover:bg-green-600 text-white border-green-500";
    }
  } else {
    // Type BAD - pas de détention
    variant = "secondary";
    icon = <Clock className="w-3 h-3" />;
    text = "Pas de détention";
    bgColor = "bg-gray-500 hover:bg-gray-600 text-white";
  }

  return (
    <div className="space-y-1">
      <Badge 
        variant={variant}
        className={`flex items-center gap-1 text-xs ${bgColor}`}
        title={`Date limite: ${format(dateLimite, "dd/MM/yyyy", { locale: fr })}`}
      >
        {icon}
        {text}
      </Badge>
      {typeDestination === "detention" && (
        <div className="text-xs text-muted-foreground">
          Limite: {format(dateLimite, "dd/MM", { locale: fr })}
        </div>
      )}
    </div>
  );
}