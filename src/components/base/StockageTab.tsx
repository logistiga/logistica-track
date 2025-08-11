import { useState } from "react";
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

interface StockageItem {
  id: string;
  nomClient: string;
  numeroConteneur: string;
  provenance: string;
  dateArrivee: string;
  camionProprietaire: boolean;
  plaqueCamion: string;
  plaqueRemorque: string;
  joursGratuits: number;
  prixParJour: number;
  statut: "stocke" | "en_attente_sortie";
}

interface StockageTabProps {
  camions: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
  remorques: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
}

export function StockageTab({ camions, remorques }: StockageTabProps) {
  const [stockages, setStockages] = useState<StockageItem[]>([
    {
      id: "1",
      nomClient: "Client ABC",
      numeroConteneur: "MSKU1234567",
      provenance: "Port de Douala",
      dateArrivee: "2024-01-15",
      camionProprietaire: true,
      plaqueCamion: "TR 37",
      plaqueRemorque: "R 01",
      joursGratuits: 5,
      prixParJour: 10000,
      statut: "stocke"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSortieDialogOpen, setIsSortieDialogOpen] = useState(false);
  const [selectedStockage, setSelectedStockage] = useState<StockageItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Transform data for forms
  const camionsParc = camions.map(c => ({ id: c.id, numeroParc: c.numeroParc }));
  const remorquesParc = remorques.map(r => ({ id: r.id, numeroParc: r.numeroParc }));

  const filteredStockages = stockages.filter(item =>
    item.numeroConteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleAddStockage = (data: any) => {
    const newStockage: StockageItem = {
      id: Date.now().toString(),
      nomClient: data.nomClient,
      numeroConteneur: data.numeroConteneur,
      provenance: data.provenance,
      dateArrivee: data.dateArrivee,
      camionProprietaire: data.camionProprietaire,
      plaqueCamion: data.plaqueCamion,
      plaqueRemorque: data.plaqueRemorque,
      joursGratuits: data.joursGratuits,
      prixParJour: data.prixParJour,
      statut: "stocke"
    };
    setStockages([...stockages, newStockage]);
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: "Conteneur ajouté au stockage avec succès"
    });
  };

  const handleSortieStockage = (data: any) => {
    if (selectedStockage) {
      // Calculate detention days
      const dateArrivee = new Date(selectedStockage.dateArrivee);
      const dateSortie = new Date(data.dateSortie);
      const joursTotal = Math.ceil((dateSortie.getTime() - dateArrivee.getTime()) / (1000 * 3600 * 24));
      const joursDetention = Math.max(0, joursTotal - selectedStockage.joursGratuits);
      const montantDetention = joursDetention * selectedStockage.prixParJour;

      // Remove from stockage (move to archives)
      setStockages(stockages.filter(s => s.id !== selectedStockage.id));
      setIsSortieDialogOpen(false);
      setSelectedStockage(null);
      
      toast({
        title: "Sortie confirmée",
        description: `Conteneur sorti - ${joursDetention} jours de détention (${montantDetention.toLocaleString()} FCFA)`
      });
    }
  };

  const handleDeleteStockage = (id: string) => {
    setStockages(stockages.filter(s => s.id !== id));
    toast({
      title: "Supprimé",
      description: "Conteneur supprimé du stockage"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
                <TableHead>Statut</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nomClient}</TableCell>
                  <TableCell>{item.numeroConteneur}</TableCell>
                  <TableCell>{item.provenance}</TableCell>
                  <TableCell>{item.dateArrivee}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.plaqueCamion}</div>
                      <div>R: {item.plaqueRemorque}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{item.joursGratuits} jours</div>
                      <div>{formatCurrency(item.prixParJour)}/j</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.statut)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
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

      <Dialog open={isSortieDialogOpen} onOpenChange={setIsSortieDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sortie du conteneur</DialogTitle>
          </DialogHeader>
          {selectedStockage && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p><strong>Conteneur:</strong> {selectedStockage.numeroConteneur}</p>
              <p><strong>Client:</strong> {selectedStockage.nomClient}</p>
              <p><strong>Date d'arrivée:</strong> {selectedStockage.dateArrivee}</p>
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