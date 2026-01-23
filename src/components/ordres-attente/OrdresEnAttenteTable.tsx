import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Ship, 
  Package,
  Calendar,
  User
} from "lucide-react";
import { OrdreTravail } from "@/types/logistique.types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrdresEnAttenteTableProps {
  ordres: OrdreTravail[];
  loading: boolean;
  onViewDetails: (ordre: OrdreTravail) => void;
  onValidate?: (ordreId: number) => void;
  onReject?: (ordreId: number) => void;
  showActions?: boolean;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  brouillon: { label: "Brouillon", variant: "secondary" },
  en_cours: { label: "En cours", variant: "default" },
  termine: { label: "Terminé", variant: "outline" },
  facture: { label: "Facturé", variant: "outline" },
  annule: { label: "Annulé", variant: "destructive" },
};

export function OrdresEnAttenteTable({
  ordres,
  loading,
  onViewDetails,
  onValidate,
  onReject,
  showActions = true,
}: OrdresEnAttenteTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (ordres.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Aucun ordre</h3>
            <p className="text-muted-foreground">
              Aucun ordre de travail dans cette catégorie
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
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

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4">
          {ordres.map((ordre) => (
            <Card key={ordre.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{ordre.numero}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ordre.client?.nom || "Client inconnu"}
                    </p>
                  </div>
                  <Badge variant={statusConfig[ordre.status]?.variant || "secondary"}>
                    {statusConfig[ordre.status]?.label || ordre.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(ordre.date)}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Ship className="h-3 w-3" />
                    {ordre.vessel_name || "-"}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Package className="h-3 w-3" />
                    {ordre.containers?.length || 0} conteneur(s)
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(ordre.montant_total)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(ordre)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  {showActions && onValidate && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onValidate(ordre.id)}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Valider
                    </Button>
                  )}
                  {showActions && onReject && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(ordre.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Ordre</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Navire</TableHead>
                <TableHead>Conteneurs</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordres.map((ordre) => (
                <TableRow key={ordre.id}>
                  <TableCell className="font-medium">{ordre.numero}</TableCell>
                  <TableCell>{ordre.client?.nom || "Client inconnu"}</TableCell>
                  <TableCell>{formatDate(ordre.date)}</TableCell>
                  <TableCell>{ordre.booking_number || "-"}</TableCell>
                  <TableCell>{ordre.vessel_name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ordre.containers?.length || 0} conteneur(s)
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(ordre.montant_total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[ordre.status]?.variant || "secondary"}>
                      {statusConfig[ordre.status]?.label || ordre.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(ordre)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {showActions && onValidate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onValidate(ordre.id)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      {showActions && onReject && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReject(ordre.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
