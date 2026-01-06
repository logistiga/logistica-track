import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { DepotageForm } from "./DepotageForm";
import { DepotageStats } from "./DepotageStats";
import { StatusBadge } from "./shared/StatusBadge";
import { depotageService, Depotage } from "@/services/depotageService";
import { useToast } from "@/components/ui/use-toast";
import { transformVehiculesToParc, VehiculeTransform, formatDateFr } from "@/utils/baseUtils";

interface DepotageTabProps {
  camions: VehiculeTransform[];
  remorques: VehiculeTransform[];
}

export function DepotageTab({ camions, remorques }: DepotageTabProps) {
  const [depotages, setDepotages] = useState<Depotage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDepotage, setSelectedDepotage] = useState<Depotage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mémoriser les transformations de véhicules
  const camionsParc = useMemo(() => transformVehiculesToParc(camions), [camions]);
  const remorquesParc = useMemo(() => transformVehiculesToParc(remorques), [remorques]);

  const loadDepotages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await depotageService.getDepotages();
      setDepotages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des dépotages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les dépotages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDepotages();
  }, [loadDepotages]);

  const filteredDepotages = useMemo(() => 
    depotages.filter(depotage =>
      depotage.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depotage.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [depotages, searchTerm]);

  const handleAddDepotage = useCallback(async (formData: any) => {
    try {
      await depotageService.createDepotage({
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
      });
      setShowDialog(false);
      loadDepotages();
      toast({ title: "Succès", description: "Dépotage créé avec succès" });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de créer le dépotage", variant: "destructive" });
    }
  }, [loadDepotages, toast]);

  const handleTerminerDepotage = useCallback(async (depotage: Depotage) => {
    try {
      await depotageService.terminerDepotage(depotage.id);
      loadDepotages();
      toast({ title: "Succès", description: `Dépotage du conteneur ${depotage.numero_conteneur} terminé` });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de terminer le dépotage", variant: "destructive" });
    }
  }, [loadDepotages, toast]);

  const handleDeleteDepotage = useCallback(async (depotage: Depotage) => {
    try {
      await depotageService.deleteDepotage(depotage.id);
      loadDepotages();
      toast({ title: "Succès", description: "Dépotage supprimé avec succès" });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de supprimer le dépotage", variant: "destructive" });
    }
  }, [loadDepotages, toast]);

  if (loading) {
    return <div className="text-center py-8">Chargement des dépotages...</div>;
  }

  return (
    <div className="space-y-6">
      <DepotageStats />
      
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher par client ou conteneur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowDialog(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Dépotage</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Dépotages</span>
            <Badge variant="secondary">{filteredDepotages.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Conteneur</TableHead>
                <TableHead>Date Dépotage</TableHead>
                <TableHead>Type Marchandise</TableHead>
                <TableHead>Camion/Remorque</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepotages.map((depotage) => (
                <TableRow key={depotage.id}>
                  <TableCell className="font-medium">{depotage.nom_client}</TableCell>
                  <TableCell>{depotage.numero_conteneur}</TableCell>
                  <TableCell>{formatDateFr(depotage.date_depotage)}</TableCell>
                  <TableCell>{depotage.type_marchandise}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{depotage.plaque_camion}</div>
                      <div className="text-muted-foreground">{depotage.plaque_remorque}</div>
                    </div>
                  </TableCell>
                  <TableCell>{depotage.prix_depotage_formate || `${depotage.prix_depotage?.toLocaleString()} FCFA`}</TableCell>
                  <TableCell>
                    <StatusBadge statut={depotage.statut} type="depotage" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {depotage.statut === 'en_cours' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTerminerDepotage(depotage)}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Terminer</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDepotage(depotage);
                          setShowDialog(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDepotage(depotage)}
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

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) setSelectedDepotage(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDepotage ? 'Modifier le Dépotage' : 'Nouveau Dépotage'}
            </DialogTitle>
          </DialogHeader>
          <DepotageForm
            onSubmit={handleAddDepotage}
            initialData={selectedDepotage || undefined}
            camionsParc={camionsParc}
            remorquesParc={remorquesParc}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
