import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { vehiculeService, type Vehicule, type CreateVehiculeData } from "@/services/vehiculeService";

export default function Materiel() {
  const [camions, setCamions] = useState<Vehicule[]>([]);
  const [remorques, setRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("camions");
  const [newVehicle, setNewVehicle] = useState({ 
    numero_parc: "", 
    immatriculation: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear()
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVehicules = async () => {
    try {
      setLoading(true);
      const vehicules = await vehiculeService.getVehicules();
      setCamions(vehicules.filter(v => v.type === 'camion'));
      setRemorques(vehicules.filter(v => v.type === 'remorque'));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les véhicules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicules();
  }, []);

  const handleAddVehicle = async () => {
    if (!newVehicle.numero_parc || !newVehicle.immatriculation) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const vehicleData: CreateVehiculeData = {
        numero_parc: newVehicle.numero_parc,
        immatriculation: newVehicle.immatriculation,
        type: activeTab === "camions" ? "camion" : "remorque",
        marque: newVehicle.marque || undefined,
        modele: newVehicle.modele || undefined,
        annee: newVehicle.annee,
        statut: "disponible",
        actif: true,
      };

      const newVehiculeCreated = await vehiculeService.createVehicule(vehicleData);
      
      if (activeTab === "camions") {
        setCamions(prev => [...prev, newVehiculeCreated]);
      } else {
        setRemorques(prev => [...prev, newVehiculeCreated]);
      }

      setNewVehicle({ 
        numero_parc: "", 
        immatriculation: "",
        marque: "",
        modele: "",
        annee: new Date().getFullYear()
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Succès",
        description: `${activeTab === "camions" ? "Camion" : "Remorque"} ajouté(e) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du véhicule",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await vehiculeService.deleteVehicule(id);
      
      if (activeTab === "camions") {
        setCamions(prev => prev.filter(c => c.id !== id));
      } else {
        setRemorques(prev => prev.filter(r => r.id !== id));
      }
      
      toast({
        title: "Supprimé",
        description: `${activeTab === "camions" ? "Camion" : "Remorque"} supprimé(e) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (statut: string) => {
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

  const filteredVehicles = (vehicles: Vehicule[]) => {
    return vehicles.filter(vehicle => 
      vehicle.numero_parc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const VehicleTable = ({ vehicles, type }: { vehicles: Vehicule[], type: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro de Parc</TableHead>
          <TableHead>Immatriculation</TableHead>
          <TableHead>Marque</TableHead>
          <TableHead>Modèle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVehicles(vehicles).map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">{vehicle.numero_parc}</TableCell>
            <TableCell>{vehicle.immatriculation}</TableCell>
            <TableCell>{vehicle.marque || '-'}</TableCell>
            <TableCell>{vehicle.modele || '-'}</TableCell>
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
                <Label htmlFor="numeroParc">Numéro de Parc *</Label>
                <Input
                  id="numeroParc"
                  value={newVehicle.numero_parc}
                  onChange={(e) => setNewVehicle({ ...newVehicle, numero_parc: e.target.value })}
                  placeholder="Ex: TR 37"
                />
              </div>
              <div>
                <Label htmlFor="immatriculation">Immatriculation *</Label>
                <Input
                  id="immatriculation"
                  value={newVehicle.immatriculation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, immatriculation: e.target.value })}
                  placeholder="Ex: LC-362-AA"
                />
              </div>
              {activeTab === "camions" && (
                <>
                  <div>
                    <Label htmlFor="marque">Marque</Label>
                    <Input
                      id="marque"
                      value={newVehicle.marque}
                      onChange={(e) => setNewVehicle({ ...newVehicle, marque: e.target.value })}
                      placeholder="Ex: Mercedes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modele">Modèle</Label>
                    <Input
                      id="modele"
                      value={newVehicle.modele}
                      onChange={(e) => setNewVehicle({ ...newVehicle, modele: e.target.value })}
                      placeholder="Ex: Actros"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annee">Année</Label>
                    <Input
                      id="annee"
                      type="number"
                      value={newVehicle.annee}
                      onChange={(e) => setNewVehicle({ ...newVehicle, annee: parseInt(e.target.value) || new Date().getFullYear() })}
                      placeholder="2024"
                    />
                  </div>
                </>
              )}
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