import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RefreshCw, Plus, Search, Edit, Trash2, CheckCircle } from "lucide-react";
import { DoubleRelevageForm } from "./DoubleRelevageForm";
import { DoubleRelevageStats } from "./DoubleRelevageStats";
import { toast } from "@/hooks/use-toast";

interface DoubleRelevageItem {
  id: string;
  nomClient: string;
  numeroConteneur: string;
  provenance: string;
  camionAmeneur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  camionRecuperateur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  montantOperation: number;
  statut: "en_attente" | "confirme";
  dateCreation: string;
}

export function DoubleRelevageTab() {
  const [operations, setOperations] = useState<DoubleRelevageItem[]>([
    {
      id: "1",
      nomClient: "Client XYZ",
      numeroConteneur: "TCLU5678901",
      provenance: "Port de Douala",
      camionAmeneur: {
        proprietaire: true,
        plaque: "TR 37",
        plaqueRemorque: "R 01"
      },
      camionRecuperateur: {
        proprietaire: false,
        plaque: "CE 789 EF",
        plaqueRemorque: "CE 012 GH"
      },
      montantOperation: 75000,
      statut: "en_attente",
      dateCreation: "2024-01-15"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for vehicles from parc
  const camionsParc = [
    { id: "1", numeroParc: "TR 37" },
    { id: "2", numeroParc: "tr 07" },
    { id: "3", numeroParc: "tr 08" },
    { id: "4", numeroParc: "TR 41" }
  ];

  const remorquesParc = [
    { id: "1", numeroParc: "R 01" },
    { id: "2", numeroParc: "R 02" },
    { id: "3", numeroParc: "R 03" }
  ];

  const filteredOperations = operations.filter(item =>
    item.numeroConteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-warning text-warning-foreground">En Attente</Badge>;
      case "confirme":
        return <Badge className="bg-success text-success-foreground">Confirmé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const handleAddOperation = (data: any) => {
    const newOperation: DoubleRelevageItem = {
      id: Date.now().toString(),
      nomClient: data.nomClient,
      numeroConteneur: data.numeroConteneur,
      provenance: data.provenance,
      camionAmeneur: data.camionAmeneur,
      camionRecuperateur: data.camionRecuperateur,
      montantOperation: data.montantOperation,
      statut: "en_attente",
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setOperations([...operations, newOperation]);
    setIsAddDialogOpen(false);
    toast({
      title: "Succès",
      description: "Opération de double relevage enregistrée"
    });
  };

  const handleConfirmOperation = (id: string) => {
    // Remove from operations (move to archives)
    setOperations(operations.filter(o => o.id !== id));
    toast({
      title: "Opération confirmée",
      description: "L'opération de double relevage a été confirmée et archivée"
    });
  };

  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter(o => o.id !== id));
    toast({
      title: "Supprimé",
      description: "Opération supprimée"
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle opération de double relevage</DialogTitle>
            </DialogHeader>
            <DoubleRelevageForm 
              onSubmit={handleAddOperation}
              camionsParc={camionsParc}
              remorquesParc={remorquesParc}
            />
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
                <TableHead>Client</TableHead>
                <TableHead>Numéro Conteneur</TableHead>
                <TableHead>Provenance</TableHead>
                <TableHead>Camion Ameneur</TableHead>
                <TableHead>Camion Récupérateur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nomClient}</TableCell>
                  <TableCell>{item.numeroConteneur}</TableCell>
                  <TableCell>{item.provenance}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.camionAmeneur.plaque}</div>
                      <div>R: {item.camionAmeneur.plaqueRemorque}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.camionRecuperateur.plaque}</div>
                      <div>R: {item.camionRecuperateur.plaqueRemorque}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.montantOperation)}</TableCell>
                  <TableCell>{getStatusBadge(item.statut)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteOperation(item.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      {item.statut === "en_attente" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConfirmOperation(item.id)}
                          className="text-success hover:bg-success hover:text-success-foreground"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
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