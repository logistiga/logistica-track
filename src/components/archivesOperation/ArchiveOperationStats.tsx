import { ArchiveOperation } from "@/types/archivesOperation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, Package, DollarSign, Calendar } from "lucide-react";

interface ArchiveOperationStatsProps {
  archives: ArchiveOperation[];
}

export function ArchiveOperationStats({ archives }: ArchiveOperationStatsProps) {
  const totalOperations = archives.length;
  const totalRevenue = archives.reduce((sum, archive) => sum + archive.montantTotal, 0);
  const avgRevenue = totalOperations > 0 ? totalRevenue / totalOperations : 0;
  
  const operationTypes = archives.reduce((acc, archive) => {
    acc[archive.typeOperation] = (acc[archive.typeOperation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topOperationType = Object.entries(operationTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Opérations</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOperations}</div>
          <p className="text-xs text-muted-foreground">
            opérations archivées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'Affaires Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            revenus totaux
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus Moyens</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(avgRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            par opération
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Type Principal</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topOperationType}</div>
          <p className="text-xs text-muted-foreground">
            type d'opération le plus fréquent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}