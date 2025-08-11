import { ArchiveOperation } from "@/types/archivesOperation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface ArchiveOperationTableProps {
  archives: ArchiveOperation[];
  onViewInvoice: (archive: ArchiveOperation) => void;
  onViewDetails: (archive: ArchiveOperation) => void;
}

export function ArchiveOperationTable({ 
  archives, 
  onViewInvoice, 
  onViewDetails 
}: ArchiveOperationTableProps) {
  const getOperationBadge = (type: string) => {
    const colors = {
      "location": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "transport": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "double-relevage": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "logistique": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    
    return (
      <Badge variant="secondary" className={colors[type as keyof typeof colors] || ""}>
        {type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archives des Opérations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Opération</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date Exécution</TableHead>
                <TableHead>Camion</TableHead>
                <TableHead>Remorque</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>N° Facture</TableHead>
                <TableHead>Date Archivage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Aucune archive trouvée
                  </TableCell>
                </TableRow>
              ) : (
                archives.map((archive) => (
                  <TableRow key={archive.id}>
                    <TableCell className="font-medium">
                      {archive.numeroOperation}
                    </TableCell>
                    <TableCell>
                      {getOperationBadge(archive.typeOperation)}
                    </TableCell>
                    <TableCell>{archive.client}</TableCell>
                    <TableCell>{formatDate(archive.dateExecution)}</TableCell>
                    <TableCell>{archive.camion}</TableCell>
                    <TableCell>{archive.remorque}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(archive.montantTotal)}
                    </TableCell>
                    <TableCell>{archive.numeroFacture}</TableCell>
                    <TableCell>{formatDate(archive.dateArchivage)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewInvoice(archive)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(archive)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}