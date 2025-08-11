import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { ArchiveBase } from "@/types/archives";

interface ArchiveTableProps {
  archives: ArchiveBase[];
  onViewInvoice: (archive: ArchiveBase) => void;
  onViewDetails: (archive: ArchiveBase) => void;
}

export function ArchiveTable({ archives, onViewInvoice, onViewDetails }: ArchiveTableProps) {
  
  const getOperationBadge = (type: string) => {
    return type === "stockage" ? (
      <Badge variant="outline">Stockage</Badge>
    ) : (
      <Badge variant="secondary">Double relevage</Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archives des opérations de base</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Conteneur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Provenance</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Sortie</TableHead>
              <TableHead>Camion/Remorque</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                  Aucune archive trouvée
                </TableCell>
              </TableRow>
            ) : (
              archives.map((archive) => (
                <TableRow key={archive.id}>
                  <TableCell>{getOperationBadge(archive.typeOperation)}</TableCell>
                  <TableCell className="font-medium">{archive.numeroConteneur}</TableCell>
                  <TableCell>{archive.nomClient}</TableCell>
                  <TableCell>{archive.provenance}</TableCell>
                  <TableCell>{formatDate(archive.dateArriveeBase)}</TableCell>
                  <TableCell>{formatDate(archive.dateSortieBase)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>A: {archive.camionArrivee}</div>
                      {archive.camionSortie && <div>S: {archive.camionSortie}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {archive.typeOperation === "stockage" && (
                      <div className="text-xs">
                        <div>{archive.joursGratuits}j gratuits</div>
                        <div>{archive.joursPayants}j payants</div>
                      </div>
                    )}
                    {archive.typeOperation === "double-relevage" && (
                      <div className="text-xs">Forfaitaire</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{archive.montantTotalFacture.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{archive.numeroFacture}</div>
                      <div>{formatDate(archive.dateFacturation)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice(archive)}
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(archive)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}