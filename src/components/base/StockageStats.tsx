import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Stockage } from "@/services/stockageService";

interface StockageStatsProps {
  stockages: Stockage[];
}

export function StockageStats({ stockages }: StockageStatsProps) {
  const totalStockes = stockages.filter(s => s.statut === "stocke").length;
  const enAttenteShortie = stockages.filter(s => s.statut === "en_attente_sortie").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stockage</p>
              <p className="text-3xl font-bold text-primary">{stockages.length}</p>
            </div>
            <div className="p-3 bg-primary-light rounded-xl">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stockés</p>
              <p className="text-3xl font-bold text-success">{totalStockes}</p>
            </div>
            <div className="p-3 bg-success-light rounded-xl">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Attente Sortie</p>
              <p className="text-3xl font-bold text-warning">{enAttenteShortie}</p>
            </div>
            <div className="p-3 bg-warning-light rounded-xl">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Capacité Utilisée</p>
              <p className="text-3xl font-bold text-info">{Math.round((stockages.length / 100) * 100)}%</p>
            </div>
            <div className="p-3 bg-info-light rounded-xl">
              <AlertCircle className="w-6 h-6 text-info" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}