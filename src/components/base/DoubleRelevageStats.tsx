import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

interface DoubleRelevageItem {
  id: string;
  nomClient: string;
  numeroConteneur: string;
  provenance: string;
  camionAmeneur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  camionRecuperateur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  montantOperation: number;
  statut: "en_attente" | "confirme";
  dateCreation: string;
}

interface DoubleRelevageStatsProps {
  operations: DoubleRelevageItem[];
}

export function DoubleRelevageStats({ operations }: DoubleRelevageStatsProps) {
  const enAttente = operations.filter(o => o.statut === "en_attente").length;
  const confirmees = operations.filter(o => o.statut === "confirme").length;
  const totalMontant = operations.reduce((acc, o) => acc + o.montantOperation, 0);

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
              <p className="text-sm font-medium text-muted-foreground">Confirmées</p>
              <p className="text-3xl font-bold text-success">{confirmees}</p>
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
              <p className="text-sm font-medium text-muted-foreground">Montant Total</p>
              <p className="text-3xl font-bold text-primary">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(totalMontant)}</p>
            </div>
            <div className="p-3 bg-primary-light rounded-xl">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}