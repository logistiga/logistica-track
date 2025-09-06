import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";
import type { Vehicule } from "@/services/vehiculeService";

interface VehicleStatsCardsProps {
  camions: Vehicule[];
  remorques: Vehicule[];
}

export function VehicleStatsCards({ camions, remorques }: VehicleStatsCardsProps) {
  const totalVehicules = camions.length + remorques.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Camions</p>
              <p className="text-3xl font-bold text-info">{camions.length}</p>
            </div>
            <div className="p-3 bg-info/10 rounded-xl">
              <Truck className="w-6 h-6 text-info" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Remorques</p>
              <p className="text-3xl font-bold text-success">{remorques.length}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-xl">
              <Truck className="w-6 h-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Véhicules</p>
              <p className="text-3xl font-bold text-primary">{totalVehicules}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Truck className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}