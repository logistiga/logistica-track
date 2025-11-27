import { DetentionContainer } from '@/types/detention';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TABLE_COLUMNS, formatCurrency, formatDate } from './tableConfig';

interface DetentionTableProps {
  containers: DetentionContainer[];
  loading?: boolean;
  onIdentifyResponsability: (container: DetentionContainer) => void;
  onGeneratePDF: (container: DetentionContainer) => void;
  onConfirmPayment: (container: DetentionContainer) => void;
}

export function DetentionTable({ containers, loading, onIdentifyResponsability, onGeneratePDF, onConfirmPayment }: DetentionTableProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (containers.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Aucune détention trouvée</div>
      </Card>
    );
  }

  const renderCell = (container: DetentionContainer, column: typeof TABLE_COLUMNS[0]) => {
    switch (column.key) {
      case 'montantTotal':
        return `${formatCurrency(container.montantTotal)} FCFA`;
      case 'dateSortie':
      case 'dateRetour':
        return formatDate(container[column.key]);
      case 'responsabilite':
        return container.responsabilite ? (
          <Badge variant="secondary">{container.responsabilite}</Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onIdentifyResponsability(container)}>
            Définir
          </Button>
        );
      case 'actions':
        // N'afficher les actions que si la responsabilité a été définie
        if (!container.responsabilite) {
          return (
            <div className="text-sm text-muted-foreground">
              Définir la responsabilité
            </div>
          );
        }
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onGeneratePDF(container)}>PDF</Button>
            <Button variant="default" size="sm" onClick={() => onConfirmPayment(container)}>Payer</Button>
          </div>
        );
      default:
        return container[column.key as keyof DetentionContainer];
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((column) => (
              <TableHead key={column.key} className={column.className}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.id}>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {renderCell(container, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}