import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  numeroParc: string;
  immatriculation: string;
  statut: "disponible" | "en_mission" | "maintenance";
}

export default function Materiel() {
  const [camions, setCamions] = useState<Vehicle[]>([
    { id: "1", numeroParc: "TR 37", immatriculation: "TR 37", statut: "disponible" },
    { id: "2", numeroParc: "tr 07", immatriculation: "tr 07", statut: "en_mission" },
    { id: "3", numeroParc: "tr 08", immatriculation: "tr 08", statut: "disponible" },
    { id: "4", numeroParc: "TR 41", immatriculation: "TR 41", statut: "disponible" },
  ]);

  const [remorques, setRemorques] = useState<Vehicle[]>([
    { id: "1", numeroParc: "R 01", immatriculation: "R01", statut: "disponible" },
    { id: "2", numeroParc: "R 02", immatriculation: "R02", statut: "disponible" },
    { id: "3", numeroParc: "R 03", immatriculation: "R03", statut: "en_mission" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("camions");
  const [newVehicle, setNewVehicle] = useState({ numeroParc: "", immatriculation: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddVehicle = () => {
    if (!newVehicle.numeroParc || !newVehicle.immatriculation) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newId = Date.now().toString();
    const vehicle: Vehicle = {
      id: newId,
      numeroParc: newVehicle.numeroParc,
      immatriculation: newVehicle.immatriculation,
      statut: "disponible",
    };

    if (activeTab === "camions") {
      setCamions([...camions, vehicle]);
    } else {
      setRemorques([...remorques, vehicle]);
    }

    setNewVehicle({ numeroParc: "", immatriculation: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: `${activeTab === "camions" ? "Camion" : "Remorque"} ajouté(e) avec succès`,
    });
  };

  const handleDeleteVehicle = (id: string) => {
    if (activeTab === "camions") {
      setCamions(camions.filter(c => c.id !== id));
    } else {
      setRemorques(remorques.filter(r => r.id !== id));
    }
    toast({
      title: "Supprimé",
      description: `${activeTab === "camions" ? "Camion" : "Remorque"} supprimé(e) avec succès`,
    });
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return <Badge className="bg-success text-success-foreground">Disponible</Badge>;
      case "en_mission":
        return <Badge className="bg-info text-info-foreground">En Mission</Badge>;
      case "maintenance":
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const filteredVehicles = (vehicles: Vehicle[]) => {
    return vehicles.filter(vehicle => 
      vehicle.numeroParc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const VehicleTable = ({ vehicles, type }: { vehicles: Vehicle[], type: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro de Parc</TableHead>
          <TableHead>Immatriculation</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVehicles(vehicles).map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">{vehicle.numeroParc}</TableCell>
            <TableCell>{vehicle.immatriculation}</TableCell>
            <TableCell>{getStatusBadge(vehicle.statut)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary rounded-xl">
            <Truck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Véhicules</h1>
            <p className="text-muted-foreground">Gérez votre flotte de camions et remorques</p>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau {activeTab === "camions" ? "Camion" : "Remorque"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Ajouter un nouveau {activeTab === "camions" ? "camion" : "remorque"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="numeroParc">Numéro de Parc</Label>
                <Input
                  id="numeroParc"
                  value={newVehicle.numeroParc}
                  onChange={(e) => setNewVehicle({ ...newVehicle, numeroParc: e.target.value })}
                  placeholder="Ex: TR 37"
                />
              </div>
              <div>
                <Label htmlFor="immatriculation">Immatriculation</Label>
                <Input
                  id="immatriculation"
                  value={newVehicle.immatriculation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, immatriculation: e.target.value })}
                  placeholder="Ex: TR 37"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddVehicle}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Camions</p>
                <p className="text-3xl font-bold text-info">{camions.length}</p>
              </div>
              <div className="p-3 bg-info-light rounded-xl">
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
              <div className="p-3 bg-success-light rounded-xl">
                <Truck className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-3xl font-bold text-primary">
                  {camions.filter(c => c.statut === "disponible").length + 
                   remorques.filter(r => r.statut === "disponible").length}
                </p>
              </div>
              <div className="p-3 bg-primary-light rounded-xl">
                <Truck className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <VehicleTable vehicles={camions} type="camions" />
            </TabsContent>
            <TabsContent value="remorques" className="mt-6">
              <VehicleTable vehicles={remorques} type="remorques" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}