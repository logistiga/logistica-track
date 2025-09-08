import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Archive, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockageForm } from "./StockageForm";
import { DoubleRelevageForm } from "./DoubleRelevageForm";
import { DepotageForm } from "./DepotageForm";
import { arriveeBaseService, ArriveeBase } from "@/services/arriveeBaseService";
import { stockageService } from "@/services/stockageService";
import { doubleRelevageService } from "@/services/doubleRelevageService";
import { depotageService } from "@/services/depotageService";
import { useToast } from "@/components/ui/use-toast";

interface ArriveeBaseTabProps {
  camions: Array<{id: string, numeroParc: string}>;
  remorques: Array<{id: string, numeroParc: string}>;
}

export function ArriveeBaseTab({ camions, remorques }: ArriveeBaseTabProps) {
  const [arrivees, setArrivees] = useState<ArriveeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArrivee, setSelectedArrivee] = useState<ArriveeBase | null>(null);
  const [operationType, setOperationType] = useState<'stockage' | 'double-relevage' | 'depotage' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadArrivees();
  }, []);

  const loadArrivees = async () => {
    try {
      setLoading(true);
      const data = await arriveeBaseService.getConteneursPourBase();
      setArrivees(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les arrivées",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOperationChoice = (arrivee: ArriveeBase, type: 'stockage' | 'double-relevage' | 'depotage') => {
    setSelectedArrivee(arrivee);
    setOperationType(type);
  };

  const handleStockageSubmit = async (formData: any) => {
    try {
      const stockageData = {
        nom_client: formData.nomClient,
        numero_conteneur: formData.numeroConteneur,
        provenance: formData.provenance,
        date_arrivee: formData.dateArrivee,
        camion_proprietaire: formData.camionProprietaire,
        plaque_camion: formData.plaqueCamion,
        plaque_remorque: formData.plaqueRemorque,
        jours_gratuits: formData.joursGratuits,
        prix_par_jour: formData.prixParJour,
        observations: formData.observations,
      };

      await stockageService.createStockage(stockageData);
      
      // Marquer le conteneur comme traité pour qu'il disparaisse de la liste
      if (selectedArrivee) {
        arriveeBaseService.marquerCommeTraite(selectedArrivee.numero_conteneur);
      }
      
      toast({
        title: "Succès",
        description: "Conteneur transféré vers le stockage",
      });

      setSelectedArrivee(null);
      setOperationType(null);
      loadArrivees();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le stockage",
        variant: "destructive",
      });
    }
  };

  const handleDoubleRelevageSubmit = async (formData: any) => {
    try {
      const doubleRelevageData = {
        nom_client: formData.nomClient,
        numero_conteneur: formData.numeroConteneur,
        provenance: formData.provenance,
        camion_ameneur_proprietaire: formData.camionAmeneur.proprietaire,
        camion_ameneur_plaque: formData.camionAmeneur.plaque,
        camion_ameneur_remorque: formData.camionAmeneur.plaqueRemorque,
        camion_recuperateur_proprietaire: formData.camionRecuperateur.proprietaire,
        camion_recuperateur_plaque: formData.camionRecuperateur.plaque,
        camion_recuperateur_remorque: formData.camionRecuperateur.plaqueRemorque,
        montant_operation: formData.montantOperation,
      };

      await doubleRelevageService.createDoubleRelevage(doubleRelevageData);
      
      // Marquer le conteneur comme traité pour qu'il disparaisse de la liste
      if (selectedArrivee) {
        arriveeBaseService.marquerCommeTraite(selectedArrivee.numero_conteneur);
      }
      
      toast({
        title: "Succès",
        description: "Conteneur transféré vers le double relevage",
      });

      setSelectedArrivee(null);
      setOperationType(null);
      loadArrivees();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le double relevage",
        variant: "destructive",
      });
    }
  };

  const handleDepotageSubmit = async (formData: any) => {
    try {
      const depotageData = {
        nom_client: formData.nomClient,
        numero_conteneur: formData.numeroConteneur,
        provenance: formData.provenance,
        date_depotage: formData.dateDepotage,
        camion_proprietaire: formData.camionProprietaire,
        plaque_camion: formData.plaqueCamion,
        plaque_remorque: formData.plaqueRemorque,
        type_marchandise: formData.typeMarchandise,
        prix_depotage: formData.prixDepotage,
        observations: formData.observations,
      };

      await depotageService.createDepotage(depotageData);
      
      // Marquer le conteneur comme traité pour qu'il disparaisse de la liste
      if (selectedArrivee) {
        arriveeBaseService.marquerCommeTraite(selectedArrivee.numero_conteneur);
      }
      
      toast({
        title: "Succès",
        description: "Conteneur transféré vers le dépotage",
      });

      setSelectedArrivee(null);
      setOperationType(null);
      loadArrivees();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le dépotage",
        variant: "destructive",
      });
    }
  };

  const getPrefilledData = (arrivee: ArriveeBase) => {
    switch (operationType) {
      case 'stockage':
        return arriveeBaseService.transformToStockage(arrivee);
      case 'double-relevage':
        return arriveeBaseService.transformToDoubleRelevage(arrivee);
      case 'depotage':
        return arriveeBaseService.transformToDepotage(arrivee);
      default:
        return {};
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des arrivées...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Conteneurs en Attente de Traitement</span>
            <Badge variant="secondary">{arrivees.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {arrivees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun conteneur en attente de traitement
            </div>
          ) : (
            <div className="space-y-4">
              {arrivees.map((arrivee) => (
                <Card key={arrivee.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4">
                          <h4 className="font-medium">{arrivee.numero_conteneur}</h4>
                          <Badge variant="outline">{arrivee.numero_bl}</Badge>
                          {arrivee.armateur && (
                            <Badge variant="secondary">{arrivee.armateur.code}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Client: {arrivee.nom_client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Arrivé le: {new Date(arrivee.date_sortie).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOperationChoice(arrivee, 'stockage')}
                          className="flex items-center space-x-1"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Stocker</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOperationChoice(arrivee, 'double-relevage')}
                          className="flex items-center space-x-1"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Double Relevage</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOperationChoice(arrivee, 'depotage')}
                          className="flex items-center space-x-1"
                        >
                          <Package className="w-4 h-4" />
                          <span>Dépoter</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour les formulaires */}
      <Dialog open={!!selectedArrivee && !!operationType} onOpenChange={() => { setSelectedArrivee(null); setOperationType(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {operationType === 'stockage' && 'Stockage du Conteneur'}
              {operationType === 'double-relevage' && 'Double Relevage du Conteneur'}
              {operationType === 'depotage' && 'Dépotage du Conteneur'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedArrivee && operationType === 'stockage' && (
            <StockageForm
              onSubmit={handleStockageSubmit}
              initialData={getPrefilledData(selectedArrivee)}
              camionsParc={camions}
              remorquesParc={remorques}
            />
          )}

          {selectedArrivee && operationType === 'double-relevage' && (
            <DoubleRelevageForm
              onSubmit={handleDoubleRelevageSubmit}
              initialData={getPrefilledData(selectedArrivee)}
              camionsParc={camions}
              remorquesParc={remorques}
            />
          )}

          {selectedArrivee && operationType === 'depotage' && (
            <DepotageForm
              onSubmit={handleDepotageSubmit}
              initialData={getPrefilledData(selectedArrivee)}
              camionsParc={camions}
              remorquesParc={remorques}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}