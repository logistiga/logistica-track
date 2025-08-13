import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Loader2 } from "lucide-react";
import { mockVehiculeService } from "@/services/mockVehiculeService";
import type { Vehicule, CreateVehiculeData } from "@/services/vehiculeService";
import { VehicleHeader } from "@/components/materiel/VehicleHeader";
import { VehicleStatsCards } from "@/components/materiel/VehicleStatsCards";
import { VehicleTable } from "@/components/materiel/VehicleTable";
import { VehicleDialog } from "@/components/materiel/VehicleDialog";
import { toast } from "@/hooks/use-toast";

export default function Materiel() {
  const [camions, setCamions] = useState<Vehicule[]>([]);
  const [remorques, setRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("camions");
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser directement le service mock pour éviter les erreurs CORS
  const fetchVehicules = async () => {
    try {
      setLoading(true);
      console.log("Fetching vehicles using mock service...");
      const vehicules = await mockVehiculeService.getVehicules();
      setCamions(vehicules.filter(v => v.type === 'camion'));
      setRemorques(vehicules.filter(v => v.type === 'remorque'));
      console.log("Vehicles loaded successfully:", vehicules.length);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les véhicules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVehicule = async (data: CreateVehiculeData): Promise<boolean> => {
    try {
      console.log("Creating vehicle:", data);
      const newVehicule = await mockVehiculeService.createVehicule(data);
      
      if (data.type === "camion") {
        setCamions(prev => [...prev, newVehicule]);
      } else {
        setRemorques(prev => [...prev, newVehicule]);
      }

      toast({
        title: "Succès",
        description: `${data.type === "camion" ? "Camion" : "Remorque"} ajouté(e) avec succès`,
      });
      return true;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du véhicule",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteVehicule = async (id: number, type: 'camion' | 'remorque'): Promise<boolean> => {
    try {
      console.log("Deleting vehicle:", id, type);
      await mockVehiculeService.deleteVehicule(id);
      
      if (type === "camion") {
        setCamions(prev => prev.filter(c => c.id !== id));
      } else {
        setRemorques(prev => prev.filter(r => r.id !== id));
      }
      
      toast({
        title: "Supprimé",
        description: `${type === "camion" ? "Camion" : "Remorque"} supprimé(e) avec succès`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    const type = activeTab === "camions" ? "camion" : "remorque";
    await deleteVehicule(id, type as 'camion' | 'remorque');
  };

  useEffect(() => {
    console.log("Materiel component mounted, fetching vehicles...");
    fetchVehicules();
  }, []);

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