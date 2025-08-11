import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, Coins, FileText } from "lucide-react";
import { FactureInterne } from "@/types/facturation";
import { formatCurrency } from "@/lib/currency";

interface FacturationStatsProps {
  factures: FactureInterne[];
}

export function FacturationStats({ factures }: FacturationStatsProps) {
  const facturesEnAttente = factures.filter(f => f.statutPaiement === "en-attente");
  const facturesPayees = factures.filter(f => f.statutPaiement === "paye");
  const montantTotal = facturesEnAttente.reduce((acc, f) => acc + f.montantAPayer, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{facturesEnAttente.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{facturesPayees.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant en attente</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(montantTotal)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total factures</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{factures.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}