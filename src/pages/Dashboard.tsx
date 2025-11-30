import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/currency";
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  CreditCard,
  Users,
  Ship,
  Clock,
  TrendingUp,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { stats, activities, alerts, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur lors du chargement des données du tableau de bord
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de vos opérations logistiques</p>
        </div>
        <Button 
          onClick={() => navigate('/sorties')}
          className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary"
        >
          <Package className="w-4 h-4 mr-2" />
          Nouvelle Sortie
        </Button>
      </div>

      {/* Alertes */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={alert.type === 'error' ? 'destructive' : 'default'}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => alert.action_url && navigate(alert.action_url)}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.title}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Conteneurs Actifs"
          value={stats?.sorties.en_cours.toString() || "0"}
          description="En cours de livraison"
          icon={Package}
          variant="info"
        />
        <StatsCard
          title="Véhicules Disponibles"
          value={stats?.vehicules.disponibles.toString() || "0"}
          description={`Sur ${stats?.vehicules.total || 0} véhicules`}
          icon={Truck}
          variant="success"
        />
        <StatsCard
          title="Détentions en Cours"
          value={stats?.detentions.actives.toString() || "0"}
          description={formatCurrency(stats?.detentions.montant_total || 0)}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Factures en Attente"
          value={stats?.facturations.en_attente.toString() || "0"}
          description={formatCurrency(stats?.facturations.montant_en_attente || 0)}
          icon={CreditCard}
          variant="pending"
        />
      </div>

      {/* Opérations Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              Opérations Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations.en_cours || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.operations.planifiees || 0} planifiées
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-success" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations.location || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats?.operations.revenue_location || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-info">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="w-4 h-4 mr-2 text-info" />
              Transports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations.transport || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats?.operations.revenue_transport || 0)}
            </p>
          </CardContent>
        </Card>
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
              {activities && activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => {
                  const timeAgo = new Date(activity.timestamp).toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short'
                  });
                  
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`} />
                        <div>
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune activité récente
                </p>
              )}
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
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/sorties')}
            >
              <Package className="w-6 h-6" />
              <span className="text-xs">Nouvelle Sortie</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/materiel')}
            >
              <Truck className="w-6 h-6" />
              <span className="text-xs">Ajouter Véhicule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/armateurs')}
            >
              <Ship className="w-6 h-6" />
              <span className="text-xs">Nouvel Armateur</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/operations')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Nouvelle Opération</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
