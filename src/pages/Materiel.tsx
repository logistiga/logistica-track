import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Loader2 } from "lucide-react";
import { useVehicules } from "@/hooks/useVehicules";
import { VehicleHeader } from "@/components/materiel/VehicleHeader";
import { VehicleStatsCards } from "@/components/materiel/VehicleStatsCards";
import { VehicleTable } from "@/components/materiel/VehicleTable";
import { filterVehicles } from "@/utils/vehiculeUtils";

export default function Materiel() {
  const [activeTab, setActiveTab] = useState("camions");
  const [searchTerm, setSearchTerm] = useState("");

  const { camions, remorques, loading } = useVehicules();

  // Optimisation avec useMemo pour le filtrage
  const filteredCamions = useMemo(
    () => filterVehicles(camions, searchTerm),
    [camions, searchTerm]
  );

  const filteredRemorques = useMemo(
    () => filterVehicles(remorques, searchTerm),
    [remorques, searchTerm]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des véhicules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
      />

      <VehicleStatsCards camions={camions} remorques={remorques} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Flotte de Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camions" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Camions ({filteredCamions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="remorques" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Remorques ({filteredRemorques.length})</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="camions" className="mt-6">
              <VehicleTable vehicles={filteredCamions} />
            </TabsContent>
            <TabsContent value="remorques" className="mt-6">
              <VehicleTable vehicles={filteredRemorques} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}