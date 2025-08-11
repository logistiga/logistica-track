import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ship, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Armateur {
  id: string;
  code: string;
  nom: string;
  typeConteneur: string;
  joursGratuits: number;
  prixParJour: number;
}

export default function Armateurs() {
  const [armateurs, setArmateurs] = useState<Armateur[]>([
    { id: "1", code: "CMA20", nom: "CMA-CGM", typeConteneur: "20' sec", joursGratuits: 2, prixParJour: 10000 },
    { id: "2", code: "CMA40", nom: "CMA-CGM", typeConteneur: "40' sec", joursGratuits: 2, prixParJour: 20000 },
    { id: "3", code: "CMA20FRIGO", nom: "CMA-CGM", typeConteneur: "20' frigo", joursGratuits: 2, prixParJour: 100000 },
    { id: "4", code: "MSK20", nom: "MAERSK", typeConteneur: "20' sec", joursGratuits: 5, prixParJour: 11800 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newArmateur, setNewArmateur] = useState({
    code: "",
    nom: "",
    typeConteneur: "",
    joursGratuits: 0,
    prixParJour: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddArmateur = () => {
    if (!newArmateur.code || !newArmateur.nom || !newArmateur.typeConteneur) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Check if code already exists
    if (armateurs.some(a => a.code === newArmateur.code)) {
      toast({
        title: "Erreur",
        description: "Ce code armateur existe déjà",
        variant: "destructive",
      });
      return;
    }

    const armateur: Armateur = {
      id: Date.now().toString(),
      ...newArmateur,
    };

    setArmateurs([...armateurs, armateur]);
    setNewArmateur({ code: "", nom: "", typeConteneur: "", joursGratuits: 0, prixParJour: 0 });
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: "Armateur ajouté avec succès",
    });
  };

  const handleDeleteArmateur = (id: string) => {
    setArmateurs(armateurs.filter(a => a.id !== id));
    toast({
      title: "Supprimé",
      description: "Armateur supprimé avec succès",
    });
  };

  const filteredArmateurs = armateurs.filter(armateur =>
    armateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.typeConteneur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getContainerBadge = (type: string) => {
    if (type.includes("frigo")) {
      return <Badge className="bg-info text-info-foreground">{type}</Badge>;
    } else if (type.includes("40")) {
      return <Badge className="bg-warning text-warning-foreground">{type}</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary rounded-xl">
            <Ship className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Armateurs</h1>
            <p className="text-muted-foreground">Gérez vos partenaires armateurs et leurs tarifs</p>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un armateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Armateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel armateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Code Unique *</Label>
                <Input
                  id="code"
                  value={newArmateur.code}
                  onChange={(e) => setNewArmateur({ ...newArmateur, code: e.target.value })}
                  placeholder="Ex: CMA20"
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom de l'Armateur *</Label>
                <Input
                  id="nom"
                  value={newArmateur.nom}
                  onChange={(e) => setNewArmateur({ ...newArmateur, nom: e.target.value })}
                  placeholder="Ex: CMA-CGM"
                />
              </div>
              <div>
                <Label htmlFor="typeConteneur">Type de Conteneur *</Label>
                <Input
                  id="typeConteneur"
                  value={newArmateur.typeConteneur}
                  onChange={(e) => setNewArmateur({ ...newArmateur, typeConteneur: e.target.value })}
                  placeholder="Ex: 20' sec"
                />
              </div>
              <div>
                <Label htmlFor="joursGratuits">Jours de Franchise</Label>
                <Input
                  id="joursGratuits"
                  type="number"
                  value={newArmateur.joursGratuits}
                  onChange={(e) => setNewArmateur({ ...newArmateur, joursGratuits: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 2"
                />
              </div>
              <div>
                <Label htmlFor="prixParJour">Prix par Jour (FCFA)</Label>
                <Input
                  id="prixParJour"
                  type="number"
                  value={newArmateur.prixParJour}
                  onChange={(e) => setNewArmateur({ ...newArmateur, prixParJour: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 10000"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddArmateur}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Armateurs</p>
                <p className="text-3xl font-bold text-primary">{new Set(armateurs.map(a => a.nom)).size}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Franchise Moyenne</p>
                <p className="text-3xl font-bold text-info">
                  {Math.round(armateurs.reduce((acc, a) => acc + a.joursGratuits, 0) / armateurs.length || 0)}
                </p>
                <p className="text-xs text-muted-foreground">Jours de franchise</p>
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
                <p className="text-sm font-medium text-muted-foreground">Modules</p>
                <p className="text-3xl font-bold text-success">{armateurs.length}</p>
                <p className="text-xs text-muted-foreground">modules disponibles</p>
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
                <p className="text-sm font-medium text-muted-foreground">Prix Moyen</p>
                <p className="text-3xl font-bold text-warning">
                  {formatPrice(armateurs.reduce((acc, a) => acc + a.prixParJour, 0) / armateurs.length || 0)}
                </p>
                <p className="text-xs text-muted-foreground">actions possibles</p>
              </div>
              <div className="p-3 bg-warning-light rounded-xl">
                <Ship className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Armateurs Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Liste des Armateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code Unique</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type Conteneur</TableHead>
                <TableHead>Franchise</TableHead>
                <TableHead>Prix/Jour</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArmateurs.map((armateur) => (
                <TableRow key={armateur.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {armateur.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{armateur.nom}</TableCell>
                  <TableCell>{getContainerBadge(armateur.typeConteneur)}</TableCell>
                  <TableCell>{armateur.joursGratuits} jours</TableCell>
                  <TableCell className="font-medium">{formatPrice(armateur.prixParJour)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArmateur(armateur.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}