import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, CheckCircle, Trash2, Package, Truck, Ship, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SortieConteneur {
  id: string;
  numeroConteneur: string;
  numeroVL: string;
  codeArmateur: string;
  camion: string;
  remorque: string;
  nomClient: string;
  destination: "base" | "client";
  adresseClient?: string;
  typeDestination: "bat" | "detention";
  joursBAT?: number;
  dateFinFranchise?: string;
  nomTransitaire: string;
  dateSortie: string;
  dateRetour?: string;
  statut: "en_cours" | "livre_client" | "a_la_base" | "retourne_port";
}

const SortieConteneur = () => {
  const { toast } = useToast();
  const [sorties, setSorties] = useState<SortieConteneur[]>([
    {
      id: "1",
      numeroConteneur: "TCLU5234567",
      numeroVL: "VL001",
      codeArmateur: "ARM001",
      camion: "CAM001",
      remorque: "REM001",
      nomClient: "Client A",
      destination: "client",
      adresseClient: "123 Rue Example",
      typeDestination: "detention",
      nomTransitaire: "Trans A",
      dateSortie: "2024-01-15",
      statut: "en_cours"
    }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState<SortieConteneur | null>(null);
  const [activeTab, setActiveTab] = useState("nouvelle");

  const [formData, setFormData] = useState({
    numeroConteneur: "",
    numeroVL: "",
    codeArmateur: "",
    camion: "",
    remorque: "",
    nomClient: "",
    destination: "",
    adresseClient: "",
    typeDestination: "",
    joursBAT: "",
    dateFinFranchise: "",
    nomTransitaire: ""
  });

  const [returnData, setReturnData] = useState({
    dateRetour: "",
    camionRetour: "",
    remorqueRetour: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nouvelleSortie: SortieConteneur = {
      id: Date.now().toString(),
      numeroConteneur: formData.numeroConteneur,
      numeroVL: formData.numeroVL,
      codeArmateur: formData.codeArmateur,
      camion: formData.camion,
      remorque: formData.remorque,
      nomClient: formData.nomClient,
      destination: formData.destination as "base" | "client",
      adresseClient: formData.adresseClient,
      typeDestination: formData.typeDestination as "bat" | "detention",
      joursBAT: formData.joursBAT ? parseInt(formData.joursBAT) : undefined,
      dateFinFranchise: formData.dateFinFranchise,
      nomTransitaire: formData.nomTransitaire,
      dateSortie: new Date().toISOString().split('T')[0],
      statut: formData.destination === "base" ? "a_la_base" : "livre_client"
    };

    setSorties([...sorties, nouvelleSortie]);
    setFormData({
      numeroConteneur: "",
      numeroVL: "",
      codeArmateur: "",
      camion: "",
      remorque: "",
      nomClient: "",
      destination: "",
      adresseClient: "",
      typeDestination: "",
      joursBAT: "",
      dateFinFranchise: "",
      nomTransitaire: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sortie ajoutée",
      description: "La nouvelle sortie de conteneur a été enregistrée."
    });
  };

  const handleConfirmReturn = () => {
    if (selectedSortie) {
      setSorties(sorties.map(s => 
        s.id === selectedSortie.id 
          ? { ...s, dateRetour: returnData.dateRetour, statut: "retourne_port" as const }
          : s
      ));
      setIsReturnDialogOpen(false);
      setSelectedSortie(null);
      setReturnData({ dateRetour: "", camionRetour: "", remorqueRetour: "" });
      
      toast({
        title: "Retour confirmé",
        description: "Le retour au port a été enregistré."
      });
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants = {
      en_cours: "default",
      livre_client: "secondary", 
      a_la_base: "outline",
      retourne_port: "destructive"
    };
    
    const labels = {
      en_cours: "En cours",
      livre_client: "Livré au client",
      a_la_base: "À la base", 
      retourne_port: "Retourné au port"
    };

    return (
      <Badge variant={variants[statut as keyof typeof variants] as any}>
        {labels[statut as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sortie de Conteneur</h1>
          <p className="text-muted-foreground">
            Gérez les sorties et le suivi des conteneurs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une nouvelle sortie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle sortie de conteneur</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle sortie de conteneur du port
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations conteneur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informations sur le conteneur
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="numeroConteneur">Numéro de conteneur</Label>
                    <Input
                      id="numeroConteneur"
                      value={formData.numeroConteneur}
                      onChange={(e) => setFormData({ ...formData, numeroConteneur: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numeroVL">Numéro de VL</Label>
                    <Input
                      id="numeroVL"
                      value={formData.numeroVL}
                      onChange={(e) => setFormData({ ...formData, numeroVL: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeArmateur">Code armateur</Label>
                    <Select value={formData.codeArmateur} onValueChange={(value) => setFormData({ ...formData, codeArmateur: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARM001">ARM001 - CMA CGM</SelectItem>
                        <SelectItem value="ARM002">ARM002 - MSC</SelectItem>
                        <SelectItem value="ARM003">ARM003 - Maersk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Transport et destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Transport et destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="camion">Numéro de camion</Label>
                      <Select value={formData.camion} onValueChange={(value) => setFormData({ ...formData, camion: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAM001">CAM001 - AB123CD</SelectItem>
                          <SelectItem value="CAM002">CAM002 - EF456GH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="remorque">Numéro de remorque</Label>
                      <Select value={formData.remorque} onValueChange={(value) => setFormData({ ...formData, remorque: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REM001">REM001 - IJ789KL</SelectItem>
                          <SelectItem value="REM002">REM002 - MN012OP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nomClient">Nom du client</Label>
                      <Input
                        id="nomClient"
                        value={formData.nomClient}
                        onChange={(e) => setFormData({ ...formData, nomClient: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="base">La base</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.destination === "client" && (
                      <div>
                        <Label htmlFor="adresseClient">Adresse du client</Label>
                        <Input
                          id="adresseClient"
                          value={formData.adresseClient}
                          onChange={(e) => setFormData({ ...formData, adresseClient: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Type de destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Type de destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="typeDestination">Type</Label>
                    <Select value={formData.typeDestination} onValueChange={(value) => setFormData({ ...formData, typeDestination: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bat">BAT (Bon à Transférer)</SelectItem>
                        <SelectItem value="detention">Détention fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.typeDestination === "bat" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="joursBAT">Nombre de jours BAT</Label>
                        <Input
                          id="joursBAT"
                          type="number"
                          value={formData.joursBAT}
                          onChange={(e) => setFormData({ ...formData, joursBAT: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateFinFranchise">Date de fin de franchise</Label>
                        <Input
                          id="dateFinFranchise"
                          type="date"
                          value={formData.dateFinFranchise}
                          onChange={(e) => setFormData({ ...formData, dateFinFranchise: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Autres informations */}
              <Card>
                <CardHeader>
                  <CardTitle>Autres informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="nomTransitaire">Nom du transitaire</Label>
                    <Input
                      id="nomTransitaire"
                      value={formData.nomTransitaire}
                      onChange={(e) => setFormData({ ...formData, nomTransitaire: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer la sortie
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nouvelle">Sorties en cours</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nouvelle" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conteneur</TableHead>
                    <TableHead>VL</TableHead>
                    <TableHead>Armateur</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Date sortie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorties.filter(s => s.statut !== "retourne_port").map((sortie) => (
                    <TableRow key={sortie.id}>
                      <TableCell className="font-medium">{sortie.numeroConteneur}</TableCell>
                      <TableCell>{sortie.numeroVL}</TableCell>
                      <TableCell>{sortie.codeArmateur}</TableCell>
                      <TableCell>{sortie.nomClient}</TableCell>
                      <TableCell>{sortie.destination === "base" ? "Base" : "Client"}</TableCell>
                      <TableCell>{sortie.dateSortie}</TableCell>
                      <TableCell>{getStatutBadge(sortie.statut)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSortie(sortie);
                              setIsReturnDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conteneur</TableHead>
                    <TableHead>VL</TableHead>
                    <TableHead>Armateur</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date sortie</TableHead>
                    <TableHead>Date retour</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorties.map((sortie) => (
                    <TableRow key={sortie.id}>
                      <TableCell className="font-medium">{sortie.numeroConteneur}</TableCell>
                      <TableCell>{sortie.numeroVL}</TableCell>
                      <TableCell>{sortie.codeArmateur}</TableCell>
                      <TableCell>{sortie.nomClient}</TableCell>
                      <TableCell>{sortie.dateSortie}</TableCell>
                      <TableCell>{sortie.dateRetour || "-"}</TableCell>
                      <TableCell>{getStatutBadge(sortie.statut)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for return confirmation */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le retour au port</DialogTitle>
            <DialogDescription>
              Enregistrez le retour du conteneur {selectedSortie?.numeroConteneur} au port
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dateRetour">Date de retour</Label>
              <Input
                id="dateRetour"
                type="date"
                value={returnData.dateRetour}
                onChange={(e) => setReturnData({ ...returnData, dateRetour: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="camionRetour">Camion de retour</Label>
              <Select value={returnData.camionRetour} onValueChange={(value) => setReturnData({ ...returnData, camionRetour: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAM001">CAM001 - AB123CD</SelectItem>
                  <SelectItem value="CAM002">CAM002 - EF456GH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorqueRetour">Remorque de retour</Label>
              <Select value={returnData.remorqueRetour} onValueChange={(value) => setReturnData({ ...returnData, remorqueRetour: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REM001">REM001 - IJ789KL</SelectItem>
                  <SelectItem value="REM002">REM002 - MN012OP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmReturn}>
              Confirmer le retour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SortieConteneur;