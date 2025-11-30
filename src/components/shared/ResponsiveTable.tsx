import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface Column {
  header: string;
  accessor: string;
  priority: 'high' | 'medium' | 'low'; // high = toujours visible, medium = tablette+, low = desktop seulement
  cell?: (value: any, row: any) => ReactNode;
  className?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  keyExtractor: (row: any) => string;
  emptyMessage?: string;
  mobileCard?: (row: any) => ReactNode; // Vue carte personnalisée pour mobile
}

export function ResponsiveTable({
  columns,
  data,
  onRowClick,
  keyExtractor,
  emptyMessage = "Aucune donnée disponible",
  mobileCard
}: ResponsiveTableProps) {
  // Filtrer les colonnes selon la priorité et la taille d'écran
  const getVisibleColumns = () => {
    // Sur mobile, afficher uniquement les colonnes high priority
    return columns;
  };

  const renderMobileCard = (row: any) => {
    if (mobileCard) {
      return mobileCard(row);
    }

    // Vue carte par défaut
    const highPriorityColumns = columns.filter(col => col.priority === 'high');
    const mediumPriorityColumns = columns.filter(col => col.priority === 'medium');

    return (
      <Card
        className={cn(
          "p-4 mb-3 cursor-pointer hover:bg-muted/50 transition-colors",
          onRowClick && "active:scale-[0.98]"
        )}
        onClick={() => onRowClick?.(row)}
      >
        <div className="space-y-2">
          {/* Colonnes high priority - affichage principal */}
          <div className="space-y-1">
            {highPriorityColumns.map((col) => (
              <div key={col.accessor}>
                {col.cell ? col.cell(row[col.accessor], row) : (
                  <div className="font-medium">{row[col.accessor]}</div>
                )}
              </div>
            ))}
          </div>

          {/* Colonnes medium priority - infos secondaires */}
          {mediumPriorityColumns.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm text-muted-foreground">
              {mediumPriorityColumns.map((col) => (
                <div key={col.accessor}>
                  <div className="text-xs">{col.header}</div>
                  {col.cell ? col.cell(row[col.accessor], row) : (
                    <div className="font-medium text-foreground">{row[col.accessor]}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Indicateur de détails disponibles */}
          {onRowClick && (
            <div className="flex items-center justify-end text-xs text-muted-foreground pt-2">
              Voir détails
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Vue mobile (cartes) */}
      <div className="block lg:hidden space-y-3">
        {data.map((row) => (
          <div key={keyExtractor(row)}>
            {renderMobileCard(row)}
          </div>
        ))}
      </div>

      {/* Vue tablette (scroll horizontal avec colonnes prioritaires) */}
      <div className="hidden md:block lg:hidden">
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[768px]">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {columns.filter(col => col.priority !== 'low').map((col) => (
                    <th
                      key={col.accessor}
                      className={cn("px-4 py-3 text-left text-sm font-medium", col.className)}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b hover:bg-muted/50 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.filter(col => col.priority !== 'low').map((col) => (
                      <td key={col.accessor} className={cn("px-4 py-3 text-sm", col.className)}>
                        {col.cell ? col.cell(row[col.accessor], row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vue desktop (toutes les colonnes) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={cn("px-4 py-3 text-left text-sm font-medium", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b hover:bg-muted/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.accessor} className={cn("px-4 py-3 text-sm", col.className)}>
                    {col.cell ? col.cell(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
