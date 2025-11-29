import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle, FileText, PlayCircle, StopCircle } from "lucide-react";
import { Operation } from "@/types/operations";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OperationTableProps {
  operations: Operation[];
  onEdit: (operation: Operation) => void;
  onDelete: (operation: Operation) => void;
  onConfirm: (operation: Operation) => void;
  onStart?: (operation: Operation) => void;
  onComplete?: (operation: Operation) => void;
  onGeneratePDF?: (operation: Operation) => void;
}

export function OperationTable({
  operations,
  onEdit,
  onDelete,
  onConfirm,
  onStart,
  onComplete,
  onGeneratePDF
}: OperationTableProps) {
  
  const getStatusBadge = (statut: Operation["statut"]) => {
    const variants = {
      "en-attente": { variant: "secondary" as const, label: "En attente" },
      "en-cours": { variant: "default" as const, label: "En cours" },
      "terminee": { variant: "outline" as const, label: "Terminée" },
      "confirmee": { variant: "default" as const, label: "Confirmée" }
    };
    const config = variants[statut];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getOperationTypeBadge = (type: Operation["typeOperation"]) => {
    const variants = {
      "location": { className: "bg-blue-100 text-blue-800", label: "Location" },
      "transport": { className: "bg-green-100 text-green-800", label: "Transport" },
      "double-relevage": { className: "bg-purple-100 text-purple-800", label: "Double relevage" },
      "logistique": { className: "bg-orange-100 text-orange-800", label: "Logistique" }
    };
    const config = variants[type];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatPeriode = (operation: Operation) => {
    if (operation.typeOperation === "location" && operation.dateFin) {
      const debut = format(new Date(operation.dateDebut), "dd/MM", { locale: fr });
      const fin = format(new Date(operation.dateFin), "dd/MM", { locale: fr });
      return `${debut} → ${fin}`;
    }
    return format(new Date(operation.dateDebut), "dd/MM/yyyy", { locale: fr });
  };

  if (!Array.isArray(operations) || operations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Aucune opération enregistrée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Camion</TableHead>
                <TableHead>Remorque</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((operation) => (
                <TableRow key={operation.id}>
                  <TableCell>{getOperationTypeBadge(operation.typeOperation)}</TableCell>
                  <TableCell className="font-medium">{formatPeriode(operation)}</TableCell>
                  <TableCell>
                    {operation.duree ? (
                      <span className="text-sm font-medium">{operation.duree} jour(s)</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{operation.client}</TableCell>
                  <TableCell className="text-sm">{operation.camion}</TableCell>
                  <TableCell className="text-sm">{operation.remorque}</TableCell>
                  <TableCell className="text-sm">
                    {operation.destination || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(operation.montant)}</TableCell>
                  <TableCell>{getStatusBadge(operation.statut)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {operation.statut === "en-attente" && onStart && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStart(operation)}
                          title="Démarrer"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {operation.statut === "en-cours" && onComplete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onComplete(operation)}
                          title="Terminer"
                        >
                          <StopCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {operation.statut === "terminee" && onGeneratePDF && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onGeneratePDF(operation)}
                          title="Générer PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(operation)}
                        disabled={operation.statut === "confirmee"}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(operation)}
                        disabled={operation.statut === "confirmee"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {operation.statut === "terminee" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onConfirm(operation)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmer
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
