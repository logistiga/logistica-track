import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Clock, CheckCircle } from "lucide-react";
import type { PrimeStats } from "@/types/prime";

interface PrimeStatsProps {
  stats: PrimeStats;
}

export function PrimeStats({ stats }: PrimeStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Primes</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_primes}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Montant: {stats.montant_total}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_en_cours}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.montant_en_cours}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_paye}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.montant_paye}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de paiement</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.total_primes > 0 
              ? Math.round((stats.nombre_paye / stats.total_primes) * 100) 
              : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.nombre_paye} / {stats.total_primes}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
