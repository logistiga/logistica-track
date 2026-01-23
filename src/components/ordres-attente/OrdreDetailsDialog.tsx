import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Hash
} from "lucide-react";
import { OrdreTravail } from "@/types/logistique.types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrdreDetailsDialogProps {
  ordre: OrdreTravail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate?: (ordreId: number) => void;
  onReject?: (ordreId: number) => void;
}

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{ordre.client?.nom || "Non spécifié"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(ordre.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{ordre.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Référence</p>
                    <p className="font-medium">{ordre.reference || "-"}</p>
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
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Booking</p>
                    <p className="font-medium">{ordre.booking_number || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conteneurs */}
          {ordre.containers && ordre.containers.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Conteneurs ({ordre.containers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ordre.containers.map((container) => (
                    <Badge key={container.id} variant="outline" className="text-sm">
                      {container.number} ({container.type})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prestations */}
          {ordre.lignes_prestations && ordre.lignes_prestations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Prestations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qté</TableHead>
                      <TableHead className="text-right">Prix unit.</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordre.lignes_prestations.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell>{ligne.description}</TableCell>
                        <TableCell className="text-right">{ligne.quantite}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(ligne.prix_unitaire)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(ligne.montant)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-semibold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(ordre.montant_total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {canValidate && onReject && (
            <Button
              variant="destructive"
              onClick={() => {
                onReject(ordre.id);
                onOpenChange(false);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          )}
          {canValidate && onValidate && (
            <Button
              onClick={() => {
                onValidate(ordre.id);
                onOpenChange(false);
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Valider
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
