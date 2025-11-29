import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Operation } from "@/types/operations";
import { Clock, DollarSign, TrendingUp, Package } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface OperationStatsProps {
  operations: Operation[];
}

export function OperationStats({ operations }: OperationStatsProps) {
  if (!Array.isArray(operations)) {
    operations = [];
  }

  // Statistiques par statut
  const enCours = operations.filter(op => op.statut === "en-cours").length;
  const terminees = operations.filter(op => op.statut === "terminee").length;
  const confirmees = operations.filter(op => op.statut === "confirmee").length;

  // Revenus par type
  const revenusParType = operations.reduce((acc, op) => {
    if (op.statut === "confirmee" || op.statut === "terminee") {
      acc[op.typeOperation] = (acc[op.typeOperation] || 0) + op.montant;
    }
    return acc;
  }, {} as Record<string, number>);

  const revenusLocations = revenusParType["location"] || 0;
  const revenusTransports = revenusParType["transport"] || 0;
  const revenusTotal = Object.values(revenusParType).reduce((sum, val) => sum + val, 0);

  // Durée moyenne des locations
  const locations = operations.filter(op => op.typeOperation === "location" && op.duree);
  const dureeMoyenne = locations.length > 0
    ? Math.round(locations.reduce((sum, op) => sum + (op.duree || 0), 0) / locations.length)
    : 0;

  // Opérations par type
  const locationCount = operations.filter(op => op.typeOperation === "location").length;
  const transportCount = operations.filter(op => op.typeOperation === "transport").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enCours}</div>
          <p className="text-xs text-muted-foreground">
            {terminees} terminées • {confirmees} confirmées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(revenusTotal)}</div>
          <p className="text-xs text-muted-foreground">
            Opérations confirmées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Locations / Transports</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationCount} / {transportCount}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(revenusLocations)} / {formatCurrency(revenusTransports)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée moy. locations</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dureeMoyenne} jours</div>
          <p className="text-xs text-muted-foreground">
            Sur {locations.length} location(s)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
