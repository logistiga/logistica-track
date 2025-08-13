import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ship, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { useArmateurs } from "@/hooks/useArmateurs";

export default function Armateurs() {
  const { armateurs, loading, createArmateur, deleteArmateur } = useArmateurs();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newArmateur, setNewArmateur] = useState({
    code: "",
    nom: "",
    type_conteneur: "",
    jours_gratuits: 0,
    prix_par_jour: 0,
    contact_nom: "",
    contact_email: "",
    contact_telephone: "",
    adresse: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddArmateur = async () => {
    if (!newArmateur.code || !newArmateur.nom) {
      return;
    }

    const success = await createArmateur({
      code: newArmateur.code,
      nom: newArmateur.nom,
      contact_nom: newArmateur.contact_nom || undefined,
      contact_email: newArmateur.contact_email || undefined,
      contact_telephone: newArmateur.contact_telephone || undefined,
      adresse: newArmateur.adresse || undefined,
      actif: true,
    });

    if (success) {
      setNewArmateur({
        code: "",
        nom: "",
        type_conteneur: "",
        jours_gratuits: 0,
        prix_par_jour: 0,
        contact_nom: "",
        contact_email: "",
        contact_telephone: "",
        adresse: "",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteArmateur = async (id: number) => {
    await deleteArmateur(id);
  };

  const filteredArmateurs = armateurs.filter(armateur =>
    armateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des armateurs...</span>
      </div>
    );
  }

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
                <Label htmlFor="contact_nom">Contact</Label>
                <Input
                  id="contact_nom"
                  value={newArmateur.contact_nom}
                  onChange={(e) => setNewArmateur({ ...newArmateur, contact_nom: e.target.value })}
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={newArmateur.contact_email}
                  onChange={(e) => setNewArmateur({ ...newArmateur, contact_email: e.target.value })}
                  placeholder="contact@armateur.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_telephone">Téléphone</Label>
                <Input
                  id="contact_telephone"
                  value={newArmateur.contact_telephone}
                  onChange={(e) => setNewArmateur({ ...newArmateur, contact_telephone: e.target.value })}
                  placeholder="+221 XX XXX XX XX"
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
                <p className="text-3xl font-bold text-success">
                  {armateurs.filter(a => a.contact_email).length}
                </p>
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
                <p className="text-3xl font-bold text-warning">
                  {armateurs.filter(a => a.actif).length}
                </p>
                <p className="text-xs text-muted-foreground">armateurs actifs</p>
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
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
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
                  <TableCell>{armateur.contact_nom || '-'}</TableCell>
                  <TableCell>{armateur.contact_email || '-'}</TableCell>
                  <TableCell>{armateur.contact_telephone || '-'}</TableCell>
                  <TableCell>
                    <Badge className={armateur.actif ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                      {armateur.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
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