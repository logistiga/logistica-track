import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Search, Edit, Trash2, LogOut } from "lucide-react";
import { StockageForm } from "./StockageForm";
import { StockageStats } from "./StockageStats";
import { SortieStockageDialog } from "./SortieStockageDialog";
import { toast } from "@/hooks/use-toast";
import { stockageService, Stockage } from "@/services/stockageService";
import { formatCurrency } from "@/lib/currency";

interface StockageTabProps {
  camions: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
  remorques: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
}

export function StockageTab({ camions, remorques }: StockageTabProps) {
  const [stockages, setStockages] = useState<Stockage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSortieDialogOpen, setIsSortieDialogOpen] = useState(false);
  const [selectedStockage, setSelectedStockage] = useState<Stockage | null>(null);
  const [editingStockage, setEditingStockage] = useState<Stockage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStockages();
  }, []);

  const loadStockages = async () => {
    try {
      setLoading(true);
      const response = await stockageService.getStockages({
        statut: 'stocke'
      });
      console.log('🔍 Stockages récupérés:', response.data);
      setStockages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des stockages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les stockages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Transform data for forms
  const camionsParc = camions.map(c => ({ id: c.id, numeroParc: c.numeroParc }));
  const remorquesParc = remorques.map(r => ({ id: r.id, numeroParc: r.numeroParc }));

  const filteredStockages = stockages.filter(item =>
    item.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "stocke":
        return <Badge className="bg-success text-success-foreground">Stocké</Badge>;
      case "en_attente_sortie":
        return <Badge className="bg-warning text-warning-foreground">En attente sortie</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const handleAddStockage = async (data: any) => {
    try {
      const stockageData = {
        nom_client: data.nomClient,
        numero_conteneur: data.numeroConteneur,
        provenance: data.provenance,
        date_arrivee: data.dateArrivee,
        camion_proprietaire: data.camionProprietaire,
        plaque_camion: data.plaqueCamion,
        plaque_remorque: data.plaqueRemorque,
        jours_gratuits: data.joursGratuits,
        prix_par_jour: data.prixParJour,
        observations: data.observations,
      };

      await stockageService.createStockage(stockageData);
      setIsAddDialogOpen(false);
      loadStockages();
      
      toast({
        title: "Succès",
        description: "Conteneur ajouté au stockage avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la création du stockage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le stockage",
        variant: "destructive",
      });
    }
  };

  const handleSortieStockage = async (data: any) => {
    if (selectedStockage) {
      try {
        const result = await stockageService.sortieStockage(selectedStockage.id, {
          date_sortie: data.dateSortie,
          observations: data.observations,
        });

        setIsSortieDialogOpen(false);
        setSelectedStockage(null);
        loadStockages();
        
        toast({
          title: "Sortie confirmée",
          description: `Conteneur sorti - ${result.detention.jours} jours de détention (${result.detention.montant_formate})`
        });
      } catch (error) {
        console.error('Erreur lors de la sortie du stockage:', error);
        toast({
          title: "Erreur",
          description: "Impossible de confirmer la sortie",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditStockage = (stockage: Stockage) => {
    setEditingStockage(stockage);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStockage = async (data: any) => {
    if (!editingStockage) return;

    try {
      const stockageData = {
        nom_client: data.nomClient,
        numero_conteneur: data.numeroConteneur,
        provenance: data.provenance,
        date_arrivee: data.dateArrivee,
        camion_proprietaire: data.camionProprietaire,
        plaque_camion: data.plaqueCamion,
        plaque_remorque: data.plaqueRemorque,
        jours_gratuits: data.joursGratuits,
        prix_par_jour: data.prixParJour,
        observations: data.observations,
      };

      await stockageService.updateStockage(editingStockage.id, stockageData);
      setIsEditDialogOpen(false);
      setEditingStockage(null);
      loadStockages();
      
      toast({
        title: "Succès",
        description: "Stockage mis à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stockage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stockage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStockage = async (id: number) => {
    try {
      await stockageService.deleteStockage(id);
      loadStockages();
      toast({
        title: "Supprimé",
        description: "Conteneur supprimé du stockage"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le stockage",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des stockages...</div>;
  }

  return (
    <div className="space-y-6">
      <StockageStats stockages={stockages} />
      
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un conteneur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Stockage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enregistrer un conteneur pour stockage</DialogTitle>
            </DialogHeader>
            <StockageForm 
              onSubmit={handleAddStockage} 
              camionsParc={camionsParc}
              remorquesParc={remorquesParc}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Conteneurs en Stockage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Numéro Conteneur</TableHead>
                <TableHead>Provenance</TableHead>
                <TableHead>Date Arrivée</TableHead>
                <TableHead>Camion</TableHead>
                <TableHead>Franchise</TableHead>
                <TableHead>Montant Actuel</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nom_client}</TableCell>
                  <TableCell>{item.numero_conteneur}</TableCell>
                  <TableCell>{item.provenance}</TableCell>
                  <TableCell>{item.date_arrivee}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.plaque_camion}</div>
                      <div>R: {item.plaque_remorque}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{item.jours_gratuits} jours</div>
                      <div>{item.prix_par_jour_formate}/j</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">
                      {formatCurrency(item.montant_detention)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(item.jours_detention)} jours payants
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.statut)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditStockage(item)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteStockage(item.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedStockage(item);
                          setIsSortieDialogOpen(true);
                        }}
                        className="text-info hover:bg-info hover:text-info-foreground"
                      >
                        <LogOut className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le stockage</DialogTitle>
          </DialogHeader>
          {editingStockage && (
            <StockageForm 
              onSubmit={handleUpdateStockage}
              camionsParc={camionsParc}
              remorquesParc={remorquesParc}
              initialData={{
                nomClient: editingStockage.nom_client,
                numeroConteneur: editingStockage.numero_conteneur,
                provenance: editingStockage.provenance,
                dateArrivee: editingStockage.date_arrivee,
                camionProprietaire: editingStockage.camion_proprietaire,
                plaqueCamion: editingStockage.plaque_camion,
                plaqueRemorque: editingStockage.plaque_remorque,
                joursGratuits: editingStockage.jours_gratuits,
                prixParJour: editingStockage.prix_par_jour,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSortieDialogOpen} onOpenChange={setIsSortieDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sortie du conteneur</DialogTitle>
          </DialogHeader>
          {selectedStockage && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p><strong>Conteneur:</strong> {selectedStockage.numero_conteneur}</p>
              <p><strong>Client:</strong> {selectedStockage.nom_client}</p>
              <p><strong>Date d'arrivée:</strong> {selectedStockage.date_arrivee}</p>
            </div>
          )}
          <SortieStockageDialog 
            onConfirm={handleSortieStockage}
            onCancel={() => setIsSortieDialogOpen(false)}
            camionsParc={camionsParc}
            remorquesParc={remorquesParc}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}