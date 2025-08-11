import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

interface DoubleRelevageItem {
  id: string;
  numeroConteneur: string;
  dateOperation: string;
  typeOperation: "entree" | "sortie";
  motif: string;
  statut: "en_attente" | "termine" | "annule";
}

interface DoubleRelevageStatsProps {
  operations: DoubleRelevageItem[];
}

export function DoubleRelevageStats({ operations }: DoubleRelevageStatsProps) {
  const enAttente = operations.filter(o => o.statut === "en_attente").length;
  const terminees = operations.filter(o => o.statut === "termine").length;
  const annulees = operations.filter(o => o.statut === "annule").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Opérations</p>
              <p className="text-3xl font-bold text-primary">{operations.length}</p>
            </div>
            <div className="p-3 bg-primary-light rounded-xl">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En Attente</p>
              <p className="text-3xl font-bold text-warning">{enAttente}</p>
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
              <p className="text-sm font-medium text-muted-foreground">Terminées</p>
              <p className="text-3xl font-bold text-success">{terminees}</p>
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
              <p className="text-sm font-medium text-muted-foreground">Annulées</p>
              <p className="text-3xl font-bold text-destructive">{annulees}</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-xl">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}