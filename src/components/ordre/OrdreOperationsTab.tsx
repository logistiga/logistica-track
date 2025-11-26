import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { OrdreOperation, UpdateOrdreOperationData } from "@/types/ordre";
import { formatCurrency } from "@/lib/currency";

interface OrdreOperationsTabProps {
  operations: OrdreOperation[];
  onUpdate: (data: UpdateOrdreOperationData) => void;
  onDelete: (operation: OrdreOperation) => void;
  onConfirm: (operation: OrdreOperation) => void;
}

export function OrdreOperationsTab({ 
  operations, 
  onUpdate, 
  onDelete, 
  onConfirm 
}: OrdreOperationsTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [numeroOrdre, setNumeroOrdre] = useState("");

  const handleEdit = (operation: OrdreOperation) => {
    setEditingId(operation.id);
    setNumeroOrdre(operation.numeroOrdre || "");
  };

  const handleSave = (id: string) => {
    if (numeroOrdre.trim()) {
      onUpdate({ id, numeroOrdre: numeroOrdre.trim() });
      setEditingId(null);
      setNumeroOrdre("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNumeroOrdre("");
  };

  const getOperationTypeBadge = (type: string) => {
    const variants = {
      location: "default",
      transport: "secondary", 
      "double-relevage": "outline",
      logistique: "destructive"
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] as any}>
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opérations en attente de validation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Camion</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>N° Ordre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell>{getOperationTypeBadge(operation.typeOperation)}</TableCell>
                <TableCell>{operation.dateExecution}</TableCell>
                <TableCell>{operation.camion}</TableCell>
                <TableCell>{operation.client}</TableCell>
                <TableCell className="font-medium">{formatCurrency(operation.montant)}</TableCell>
                <TableCell>
                  {editingId === operation.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={numeroOrdre}
                        onChange={(e) => setNumeroOrdre(e.target.value)}
                        placeholder="N° Ordre"
                        className="w-32"
                      />
                      <Button size="sm" onClick={() => handleSave(operation.id)}>
                        OK
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    operation.numeroOrdre || "Non défini"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(operation)}
                      disabled={editingId === operation.id}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(operation)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {operation.numeroOrdre && (
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