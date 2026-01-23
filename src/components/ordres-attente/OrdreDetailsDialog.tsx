import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Ship, 
  Calendar,
  Package,
  FileText,
  Hash,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { OrdreTravail, Container, LignePrestation } from "@/types/logistique.types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrdreDetailsDialogProps {
  ordre: OrdreTravail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate?: (ordreId: number, data: ValidationData) => void;
  onReject?: (ordreId: number) => void;
}

interface ValidationData {
  containers: Container[];
  lignes_prestations: Omit<LignePrestation, 'id' | 'montant'>[];
}

const CONTAINER_TYPES = ["20GP", "40GP", "40HC", "20RF", "40RF", "20OT", "40OT"];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  brouillon: { label: "Brouillon", variant: "secondary" },
  en_cours: { label: "En cours", variant: "default" },
  termine: { label: "Terminé", variant: "outline" },
  facture: { label: "Facturé", variant: "outline" },
  annule: { label: "Annulé", variant: "destructive" },
};

export function OrdreDetailsDialog({
  ordre,
  open,
  onOpenChange,
  onValidate,
  onReject,
}: OrdreDetailsDialogProps) {
  // État local pour les modifications
  const [editedContainers, setEditedContainers] = useState<Container[]>([]);
  const [prestations, setPrestations] = useState<Omit<LignePrestation, 'id' | 'montant'>[]>([]);

  // Initialiser les données quand l'ordre change
  useEffect(() => {
    if (ordre) {
      setEditedContainers(ordre.containers.map(c => ({ ...c })));
      setPrestations(ordre.lignes_prestations.map(p => ({
        description: p.description,
        quantite: p.quantite,
        prix_unitaire: p.prix_unitaire,
      })));
    }
  }, [ordre]);

  // Vérifier si les données sont complètes
  const isDataComplete = useMemo(() => {
    const allContainersComplete = editedContainers.every(c => c.type && c.type.trim() !== '');
    return allContainersComplete;
  }, [editedContainers]);

  // Calculer le montant total
  const montantTotal = useMemo(() => {
    return prestations.reduce((sum, p) => sum + (p.quantite * p.prix_unitaire), 0);
  }, [prestations]);

  if (!ordre) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const canValidate = ordre.status === "brouillon" || ordre.status === "en_cours";

  const handleContainerTypeChange = (index: number, type: string) => {
    setEditedContainers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type };
      return updated;
    });
  };

  const handleContainerDescChange = (index: number, description: string) => {
    setEditedContainers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], description };
      return updated;
    });
  };

  const handleAddPrestation = () => {
    setPrestations(prev => [...prev, { description: "", quantite: 1, prix_unitaire: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    setPrestations(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrestationChange = (index: number, field: keyof Omit<LignePrestation, 'id' | 'montant'>, value: string | number) => {
    setPrestations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleValidate = () => {
    if (onValidate && isDataComplete) {
      onValidate(ordre.id, {
        containers: editedContainers,
        lignes_prestations: prestations,
      });
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(ordre.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ordre de Travail - {ordre.numero}</span>
            <Badge variant={statusConfig[ordre.status]?.variant || "secondary"}>
              {statusConfig[ordre.status]?.label || ordre.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{ordre.client?.nom || "Non spécifié"}</p>
                  </div>
                </div>
                {ordre.transitaire_nom && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transitaire</p>
                      <p className="font-medium">{ordre.transitaire_nom}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(ordre.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Booking</p>
                    <p className="font-medium">{ordre.booking_number || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Navire</p>
                    <p className="font-medium">{ordre.vessel_name || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <Badge variant="outline" className="text-xs">
                      {ordre.source === 'external' ? 'App externe' : ordre.source || 'Manuel'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conteneurs - Éditable */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Conteneurs ({editedContainers.length})
                {!isDataComplete && canValidate && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Incomplet
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Taille/Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedContainers.map((container, index) => (
                    <TableRow key={container.id || index}>
                      <TableCell className="font-mono font-medium">
                        {container.number}
                      </TableCell>
                      <TableCell>
                        {canValidate ? (
                          <Select
                            value={container.type || ""}
                            onValueChange={(value) => handleContainerTypeChange(index, value)}
                          >
                            <SelectTrigger className={`w-28 ${!container.type ? 'border-destructive' : ''}`}>
                              <SelectValue placeholder="Taille" />
                            </SelectTrigger>
                            <SelectContent>
                              {CONTAINER_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{container.type || "-"}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {canValidate ? (
                          <Input
                            placeholder="Description (optionnel)"
                            value={container.description || ""}
                            onChange={(e) => handleContainerDescChange(index, e.target.value)}
                            className="max-w-xs"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            {container.description || "-"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Prestations - Éditable */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prestations</CardTitle>
                {canValidate && (
                  <Button size="sm" variant="outline" onClick={handleAddPrestation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {prestations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="text-right">Qté</TableHead>
                      <TableHead className="text-right">Prix unit.</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      {canValidate && <TableHead className="w-10"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prestations.map((prestation, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {canValidate ? (
                            <Input
                              placeholder="Description de la prestation"
                              value={prestation.description}
                              onChange={(e) => handlePrestationChange(index, 'description', e.target.value)}
                            />
                          ) : (
                            prestation.description
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canValidate ? (
                            <Input
                              type="number"
                              min="0"
                              value={prestation.quantite}
                              onChange={(e) => handlePrestationChange(index, 'quantite', parseFloat(e.target.value) || 0)}
                              className="w-20 text-right"
                            />
                          ) : (
                            prestation.quantite
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canValidate ? (
                            <Input
                              type="number"
                              min="0"
                              value={prestation.prix_unitaire}
                              onChange={(e) => handlePrestationChange(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                              className="w-28 text-right"
                            />
                          ) : (
                            formatCurrency(prestation.prix_unitaire)
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(prestation.quantite * prestation.prix_unitaire)}
                        </TableCell>
                        {canValidate && (
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemovePrestation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(montantTotal)}
                      </TableCell>
                      {canValidate && <TableCell></TableCell>}
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune prestation</p>
                  {canValidate && (
                    <Button size="sm" variant="outline" onClick={handleAddPrestation} className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une prestation
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {canValidate && onReject && (
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          )}
          {canValidate && onValidate && (
            <Button onClick={handleValidate} disabled={!isDataComplete}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Valider
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
