import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RefreshCw, Plus, Search, Eye } from "lucide-react";
import { DoubleRelevageForm } from "./DoubleRelevageForm";
import { DoubleRelevageStats } from "./DoubleRelevageStats";
import { toast } from "@/hooks/use-toast";

interface DoubleRelevageItem {
  id: string;
  numeroConteneur: string;
  dateOperation: string;
  typeOperation: "entree" | "sortie";
  motif: string;
  statut: "en_attente" | "termine" | "annule";
}

export function DoubleRelevageTab() {
  const [operations, setOperations] = useState<DoubleRelevageItem[]>([
    {
      id: "1",
      numeroConteneur: "TCLU5678901",
      dateOperation: "2024-01-15",
      typeOperation: "entree",
      motif: "Repositionnement",
      statut: "termine"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOperations = operations.filter(item =>
    item.numeroConteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.motif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-warning text-warning-foreground">En Attente</Badge>;
      case "termine":
        return <Badge className="bg-success text-success-foreground">Terminé</Badge>;
      case "annule":
        return <Badge className="bg-destructive text-destructive-foreground">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "entree" 
      ? <Badge className="bg-info text-info-foreground">Entrée</Badge>
      : <Badge className="bg-primary text-primary-foreground">Sortie</Badge>;
  };

  const handleAddOperation = (data: Omit<DoubleRelevageItem, "id">) => {
    const newOperation: DoubleRelevageItem = {
      id: Date.now().toString(),
      ...data
    };
    setOperations([...operations, newOperation]);
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: "Opération de double relevage ajoutée"
    });
  };

  return (
    <div className="space-y-6">
      <DoubleRelevageStats operations={operations} />
      
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une opération..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Opération
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle opération de double relevage</DialogTitle>
            </DialogHeader>
            <DoubleRelevageForm onSubmit={handleAddOperation} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Opérations de Double Relevage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro Conteneur</TableHead>
                <TableHead>Date Opération</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.numeroConteneur}</TableCell>
                  <TableCell>{item.dateOperation}</TableCell>
                  <TableCell>{getTypeBadge(item.typeOperation)}</TableCell>
                  <TableCell>{item.motif}</TableCell>
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