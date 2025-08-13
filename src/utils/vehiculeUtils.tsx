import { Badge } from "@/components/ui/badge";
import type { Vehicule } from "@/services/vehiculeService";

export const getStatusBadge = (statut: string) => {
  switch (statut) {
    case "disponible":
      return <Badge className="bg-success text-success-foreground">Disponible</Badge>;
    case "en_mission":
      return <Badge className="bg-info text-info-foreground">En Mission</Badge>;
    case "maintenance":
      return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
    case "hors_service":
      return <Badge className="bg-destructive text-destructive-foreground">Hors Service</Badge>;
    default:
      return <Badge variant="secondary">{statut}</Badge>;
  }
};

export const filterVehicles = (vehicles: Vehicule[], searchTerm: string): Vehicule[] => {
  return vehicles.filter(vehicle => 
    vehicle.numero_parc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );
};