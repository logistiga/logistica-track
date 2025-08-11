import { useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  id: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  width?: number;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemHeight?: number;
  pageSize?: number;
  className?: string;
}

export function VirtualizedTable<T>({ 
  data, 
  columns, 
  itemHeight = 60,
  pageSize = 50,
  className 
}: VirtualizedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = paginatedData[index];
    if (!item) return null;

    return (
      <div style={style}>
        <TableRow className="border-b hover:bg-muted/50 transition-colors">
          {columns.map((column) => (
            <TableCell 
              key={column.id} 
              className="p-4"
              style={{ width: column.width }}
            >
              {column.accessor(item)}
            </TableCell>
          ))}
        </TableRow>
      </div>
    );
  };

  const maxHeight = Math.min(paginatedData.length * itemHeight, 600);

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  style={{ width: column.width }}
                  className="sticky top-0 bg-background z-10"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        
        <div className="relative">
          <List
            height={maxHeight}
            itemCount={paginatedData.length}
            itemSize={itemHeight}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} sur {totalPages} ({data.length} éléments)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}