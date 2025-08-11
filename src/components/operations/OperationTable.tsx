import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { Operation } from "@/types/operations";

interface OperationTableProps {
  operations: Operation[];
  onEdit: (operation: Operation) => void;
  onDelete: (operation: Operation) => void;
  onConfirm: (operation: Operation) => void;
}

export function OperationTable({ 
  operations, 
  onEdit, 
  onDelete, 
  onConfirm 
}: OperationTableProps) {
  
  const getStatusBadge = (statut: string) => {
    return statut === "confirmee" ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Confirmée
      </Badge>
    ) : (
      <Badge variant="destructive">
        En attente
      </Badge>
    );
  };

  const getOperationTypeBadge = (type: string) => {
    const variants = {
      location: "default",
      transport: "secondary", 
      "double-relevage": "outline",
      logistique: "destructive"
    };

    const labels = {
      location: "Location",
      transport: "Transport",
      "double-relevage": "Double relevage", 
      logistique: "Logistique"
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] as any}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des opérations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date d'exécution</TableHead>
              <TableHead>Camion</TableHead>
              <TableHead>Remorque</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell>{getOperationTypeBadge(operation.typeOperation)}</TableCell>
                <TableCell>{operation.dateExecution}</TableCell>
                <TableCell>{operation.camion}</TableCell>
                <TableCell>{operation.remorque}</TableCell>
                <TableCell>{operation.client}</TableCell>
                <TableCell className="max-w-xs truncate">{operation.instructions}</TableCell>
                <TableCell className="font-medium">{operation.montant.toFixed(2)} €</TableCell>
                <TableCell>{getStatusBadge(operation.statut)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(operation)}
                      disabled={operation.statut === "confirmee"}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(operation)}
                      disabled={operation.statut === "confirmee"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {operation.statut === "en-attente" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirm(operation)}
                      >
                        <CheckCircle className="w-4 h-4" />
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
  );
}