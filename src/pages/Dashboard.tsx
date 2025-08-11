import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  CreditCard,
  Users,
  Ship,
  Clock
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de vos opérations logistiques</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary">
          <Package className="w-4 h-4 mr-2" />
          Nouvelle Sortie
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Conteneurs Actifs"
          value="24"
          description="En cours de livraison"
          icon={Package}
          variant="info"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Véhicules Disponibles"
          value="18"
          description="Camions et remorques"
          icon={Truck}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Détentions en Cours"
          value="7"
          description="Dépassement franchise"
          icon={AlertTriangle}
          variant="warning"
          trend={{ value: -8, isPositive: false }}
        />
        <StatsCard
          title="Factures en Attente"
          value="12 450 €"
          description="À encaisser ce mois"
          icon={CreditCard}
          variant="pending"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <ActivityChart />

        {/* Recent Operations */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Opérations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Sortie", container: "MSKU1234567", client: "Client ABC", time: "Il y a 2h", status: "en-cours" },
                { type: "Retour", container: "HLXU9876543", client: "Client XYZ", time: "Il y a 4h", status: "termine" },
                { type: "Détention", container: "TCLU4567890", client: "Client DEF", time: "Il y a 6h", status: "alerte" },
                { type: "Facturation", container: "GESU1112233", client: "Client GHI", time: "Il y a 8h", status: "attente" },
              ].map((operation, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      operation.status === "en-cours" ? "bg-info" :
                      operation.status === "termine" ? "bg-success" :
                      operation.status === "alerte" ? "bg-warning" : "bg-pending"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{operation.type} - {operation.container}</p>
                      <p className="text-xs text-muted-foreground">{operation.client}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{operation.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="w-6 h-6" />
              <span className="text-xs">Nouvelle Sortie</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Truck className="w-6 h-6" />
              <span className="text-xs">Ajouter Véhicule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Ship className="w-6 h-6" />
              <span className="text-xs">Nouvel Armateur</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span className="text-xs">Gestion Utilisateurs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
