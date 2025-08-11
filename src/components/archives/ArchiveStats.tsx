import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Package, Coins, FileText } from "lucide-react";
import { ArchiveBase } from "@/types/archives";
import { formatCurrency } from "@/lib/currency";

interface ArchiveStatsProps {
  archives: ArchiveBase[];
}

export function ArchiveStats({ archives }: ArchiveStatsProps) {
  const operationsStockage = archives.filter(a => a.typeOperation === "stockage");
  const operationsDoubleRelevage = archives.filter(a => a.typeOperation === "double-relevage");
  const montantTotal = archives.reduce((acc, a) => acc + a.montantTotalFacture, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total archives</CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{archives.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stockages</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operationsStockage.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Double relevages</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operationsDoubleRelevage.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(montantTotal)}</div>
        </CardContent>
      </Card>
    </div>
  );
}