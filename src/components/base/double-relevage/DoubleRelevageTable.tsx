import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DoubleRelevageActions } from "./DoubleRelevageActions";
import type { DoubleRelevage } from "@/services/doubleRelevageService";

interface DoubleRelevageTableProps {
  operations: DoubleRelevage[];
  onConfirm: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DoubleRelevageTable({ 
  operations, 
  onConfirm, 
  onDelete 
}: DoubleRelevageTableProps) {
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-warning text-warning-foreground">En Attente</Badge>;
      case "confirme":
        return <Badge className="bg-success text-success-foreground">Confirmé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Numéro Conteneur</TableHead>
          <TableHead>Provenance</TableHead>
          <TableHead>Camion Ameneur</TableHead>
          <TableHead>Camion Récupérateur</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-32">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operations.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.nom_client}</TableCell>
            <TableCell>{item.numero_conteneur}</TableCell>
            <TableCell>{item.provenance}</TableCell>
            <TableCell>
              <div className="text-xs">
                <div>C: {item.camion_ameneur.plaque}</div>
                <div>R: {item.camion_ameneur.plaque_remorque}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-xs">
                <div>C: {item.camion_recuperateur.plaque}</div>
                <div>R: {item.camion_recuperateur.plaque_remorque}</div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{formatCurrency(item.montant_operation)}</TableCell>
            <TableCell>{getStatusBadge(item.statut)}</TableCell>
            <TableCell>
              <DoubleRelevageActions
                statut={item.statut}
                onConfirm={() => onConfirm(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}