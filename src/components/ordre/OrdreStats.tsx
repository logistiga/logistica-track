import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Package } from "lucide-react";
import { OrdreOperation, OrdreSortieStandard } from "@/types/ordre";

interface OrdreStatsProps {
  operations: OrdreOperation[];
  sorties: OrdreSortieStandard[];
}

export function OrdreStats({ operations, sorties }: OrdreStatsProps) {
  const operationsEnAttente = operations.filter(op => op.statut === "en-attente");
  const sortiesEnAttente = sorties.filter(s => s.statut === "en-attente");
  const totalValidees = operations.filter(op => op.statut === "valide").length + 
                       sorties.filter(s => s.statut === "valide").length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Opérations en attente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operationsEnAttente.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sorties en attente</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sortiesEnAttente.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total validées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValidees}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total en cours</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operationsEnAttente.length + sortiesEnAttente.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}