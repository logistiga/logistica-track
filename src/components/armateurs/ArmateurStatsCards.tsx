import { Card, CardContent } from "@/components/ui/card";
import { Ship } from "lucide-react";
import type { Armateur } from "@/services/armateurService";

interface ArmateurStatsCardsProps {
  armateurs: Armateur[];
}

export function ArmateurStatsCards({ armateurs }: ArmateurStatsCardsProps) {
  const totalArmateurs = new Set(armateurs.map(a => a.nom)).size;
  const armateurAvecEmail = armateurs.filter(a => a.contact_email).length;
  const armateursActifs = armateurs.filter(a => a.actif).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Armateurs</p>
              <p className="text-3xl font-bold text-primary">{totalArmateurs}</p>
              <p className="text-xs text-muted-foreground">Partenaires actifs</p>
            </div>
            <div className="p-3 bg-primary-light rounded-xl">
              <Ship className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Codes Disponibles</p>
              <p className="text-3xl font-bold text-info">{armateurs.length}</p>
              <p className="text-xs text-muted-foreground">codes armateurs</p>
            </div>
            <div className="p-3 bg-info-light rounded-xl">
              <Ship className="w-6 h-6 text-info" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contacts</p>
              <p className="text-3xl font-bold text-success">{armateurAvecEmail}</p>
              <p className="text-xs text-muted-foreground">avec email</p>
            </div>
            <div className="p-3 bg-success-light rounded-xl">
              <Ship className="w-6 h-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actifs</p>
              <p className="text-3xl font-bold text-warning">{armateursActifs}</p>
              <p className="text-xs text-muted-foreground">armateurs actifs</p>
            </div>
            <div className="p-3 bg-warning-light rounded-xl">
              <Ship className="w-6 h-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}