import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Loader2 } from "lucide-react";
import { useVehicules } from "@/hooks/useVehicules";
import type { CreateVehiculeData } from "@/services/vehiculeService";
import { VehicleHeader } from "@/components/materiel/VehicleHeader";
import { VehicleStatsCards } from "@/components/materiel/VehicleStatsCards";
import { VehicleTable } from "@/components/materiel/VehicleTable";
import { VehicleDialog } from "@/components/materiel/VehicleDialog";
import { toast } from "@/hooks/use-toast";

export default function Materiel() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("camions");
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser le hook qui gère les vraies APIs
  const {
    camions,
    remorques,
    loading,
    createVehicule,
    deleteVehicule
  } = useVehicules();

  const handleDeleteVehicle = async (id: number) => {
    const type = activeTab === "camions" ? "camion" : "remorque";
    await deleteVehicule(id, type as 'camion' | 'remorque');
  };

  console.log("Materiel component mounted, using real APIs...");

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
        onAddClick={() => setIsAddDialogOpen(true)}
        activeTab={activeTab}
      />

      <VehicleStatsCards camions={camions} remorques={remorques} />

      {/* Vehicles Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Flotte de Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camions" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Camions ({camions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="remorques" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Remorques ({remorques.length})</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="camions" className="mt-6">
              <VehicleTable 
                vehicles={camions} 
                searchTerm={searchTerm}
                onDelete={handleDeleteVehicle}
              />
            </TabsContent>
            <TabsContent value="remorques" className="mt-6">
              <VehicleTable 
                vehicles={remorques} 
                searchTerm={searchTerm}
                onDelete={handleDeleteVehicle}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <VehicleDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={createVehicule}
        activeTab={activeTab}
      />
    </div>
  );
}