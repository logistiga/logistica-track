import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, Plus, Search, Eye } from "lucide-react";
import { StockageForm } from "./StockageForm";
import { StockageStats } from "./StockageStats";
import { toast } from "@/hooks/use-toast";

interface StockageItem {
  id: string;
  numeroConteneur: string;
  dateEntree: string;
  position: string;
  statut: "stocke" | "en_cours" | "sorti";
  clientOrigine: string;
}

export function StockageTab() {
  const [stockages, setStockages] = useState<StockageItem[]>([
    {
      id: "1",
      numeroConteneur: "MSKU1234567",
      dateEntree: "2024-01-15",
      position: "A1-15",
      statut: "stocke",
      clientOrigine: "Client ABC"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStockages = stockages.filter(item =>
    item.numeroConteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clientOrigine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "stocke":
        return <Badge className="bg-success text-success-foreground">Stocké</Badge>;
      case "en_cours":
        return <Badge className="bg-warning text-warning-foreground">En cours</Badge>;
      case "sorti":
        return <Badge className="bg-info text-info-foreground">Sorti</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const handleAddStockage = (data: Omit<StockageItem, "id">) => {
    const newStockage: StockageItem = {
      id: Date.now().toString(),
      ...data
    };
    setStockages([...stockages, newStockage]);
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: "Conteneur ajouté au stockage"
    });
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter au stockage</DialogTitle>
            </DialogHeader>
            <StockageForm onSubmit={handleAddStockage} />
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
                <TableHead>Numéro Conteneur</TableHead>
                <TableHead>Date d'Entrée</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Client d'Origine</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.numeroConteneur}</TableCell>
                  <TableCell>{item.dateEntree}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.clientOrigine}</TableCell>
                  <TableCell>{getStatusBadge(item.statut)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
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