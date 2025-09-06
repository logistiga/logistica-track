import { Badge } from "@/components/ui/badge";
import type { Armateur } from "@/services/armateurService";

export const getStatusBadge = (actif: boolean) => {
  return (
    <Badge className={actif ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
      {actif ? "Actif" : "Inactif"}
    </Badge>
  );
};

export const filterArmateurs = (armateurs: Armateur[], searchTerm: string): Armateur[] => {
  return armateurs.filter(armateur =>
    armateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.type_conteneur.toLowerCase().includes(searchTerm.toLowerCase())
  );
};