import { useState, useEffect } from "react";
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
import { doubleRelevageService, type DoubleRelevage } from "@/services/doubleRelevageService";

interface DoubleRelevageTabProps {
  camions: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
  remorques: Array<{id: string, numeroParc: string, immatriculation: string, statut: string}>;
}

export function DoubleRelevageTab({ camions, remorques }: DoubleRelevageTabProps) {
  const [operations, setOperations] = useState<DoubleRelevage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadDoubleRelevages();
  }, []);

  const loadDoubleRelevages = async () => {
    try {
      setLoading(true);
      const response = await doubleRelevageService.getDoubleRelevages();
      setOperations(response.data);
    } catch (error) {
      console.error('Error loading double relevages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les opérations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddOperation = async (data: any) => {
    try {
      await doubleRelevageService.createDoubleRelevage({
        nom_client: data.nomClient,
        numero_conteneur: data.numeroConteneur,
        provenance: data.provenance,
        camion_ameneur_proprietaire: data.camionAmeneur.proprietaire,
        camion_ameneur_plaque: data.camionAmeneur.plaque,
        camion_ameneur_remorque: data.camionAmeneur.plaqueRemorque,
        camion_recuperateur_proprietaire: data.camionRecuperateur.proprietaire,
        camion_recuperateur_plaque: data.camionRecuperateur.plaque,
        camion_recuperateur_remorque: data.camionRecuperateur.plaqueRemorque,
        montant_operation: data.montantOperation,
        observations: data.observations
      });
      
      setIsAddDialogOpen(false);
      loadDoubleRelevages(); // Reload data
      toast({
        title: "Succès",
        description: "Opération de double relevage enregistrée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'opération",
        variant: "destructive"
      });
    }
  };

  const handleConfirmOperation = async (id: number) => {
    try {
      await doubleRelevageService.confirmerDoubleRelevage(id);
      loadDoubleRelevages(); // Reload data
      toast({
        title: "Opération confirmée",
        description: "L'opération de double relevage a été confirmée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de confirmer l'opération",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOperation = async (id: number) => {
    try {
      await doubleRelevageService.deleteDoubleRelevage(id);
      loadDoubleRelevages(); // Reload data
      toast({
        title: "Supprimé",
        description: "Opération supprimée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'opération",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Chargement...
      </div>
    );
  }

  // Transform data for forms
  const camionsParc = camions.map(c => ({ id: c.id, numeroParc: c.numeroParc }));
  const remorquesParc = remorques.map(r => ({ id: r.id, numeroParc: r.numeroParc }));

  const filteredOperations = operations.filter(item =>
    item.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <TableCell className="font-medium">{item.nom_client}</TableCell>
                  <TableCell>{item.numero_conteneur}</TableCell>
                  <TableCell>{item.provenance}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.camion_ameneur.plaque}</div>
                      <div>R: {item.camion_ameneur.plaque_remorque}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>C: {item.camion_recuperateur.plaque}</div>
                      <div>R: {item.camion_recuperateur.plaque_remorque}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.montant_operation)}</TableCell>
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