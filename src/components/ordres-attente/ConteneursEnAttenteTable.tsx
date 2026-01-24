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
  PlusCircle, 
  Ship, 
  Package,
  Calendar,
  User,
  Anchor,
  FileText
} from "lucide-react";
import { OrdreTravail, Container } from "@/types/logistique.types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConteneurEnAttenteItem {
  ordre: OrdreTravail;
  container: Container;
}

interface ConteneursEnAttenteTableProps {
  ordres: OrdreTravail[];
  loading: boolean;
  onViewDetails: (ordre: OrdreTravail) => void;
  onCreateSortie: (ordre: OrdreTravail, container: Container) => void;
}

export function ConteneursEnAttenteTable({
  ordres,
  loading,
  onViewDetails,
  onCreateSortie,
}: ConteneursEnAttenteTableProps) {
  // Aplatir les ordres pour avoir une ligne par conteneur
  const conteneurs: ConteneurEnAttenteItem[] = ordres.flatMap(ordre => 
    (ordre.containers || []).map(container => ({
      ordre,
      container,
    }))
  );

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

  if (conteneurs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Aucun conteneur en attente</h3>
            <p className="text-muted-foreground">
              Les conteneurs reçus de l'app de facturation apparaîtront ici
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

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4">
          {conteneurs.map(({ ordre, container }, index) => (
            <Card key={`${ordre.id}-${container.id || index}`} className="p-4 border-l-4 border-l-primary">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-bold text-lg">{container.number}</p>
                    {container.type && (
                      <Badge variant="outline" className="mt-1">{container.type}</Badge>
                    )}
                  </div>
                  <Badge variant="secondary">En attente</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    BL: {ordre.booking_number || "-"}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    {ordre.client?.nom || "Client inconnu"}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Anchor className="h-3 w-3" />
                    {ordre.armateur_nom || "-"}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(ordre.date)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(ordre)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onCreateSortie(ordre, container)}
                    className="flex-1"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Créer Sortie
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">N° Conteneur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="min-w-[120px]">N° BL</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Transitaire</TableHead>
                <TableHead>Armateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conteneurs.map(({ ordre, container }, index) => (
                <TableRow key={`${ordre.id}-${container.id || index}`}>
                  <TableCell className="font-mono font-bold">
                    {container.number}
                  </TableCell>
                  <TableCell>
                    {container.type ? (
                      <Badge variant="outline">{container.type}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {ordre.booking_number || "-"}
                  </TableCell>
                  <TableCell>{ordre.client?.nom || "Client inconnu"}</TableCell>
                  <TableCell>{ordre.transitaire_nom || "-"}</TableCell>
                  <TableCell>{ordre.armateur_nom || "-"}</TableCell>
                  <TableCell>{formatDate(ordre.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(ordre)}
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onCreateSortie(ordre, container)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Créer Sortie
                      </Button>
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
