import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart, StatusPieChart, TopArmateursChart } from "@/components/dashboard/ActivityChart";
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
  Ship,
  Clock,
  TrendingUp,
  MapPin,
  RefreshCw,
  Calendar,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { stats, activities, alerts, charts, isLoading, error, refetch } = useDashboard();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des données du tableau de bord. 
            Vérifiez que le backend est synchronisé.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => refetch()}
            size="icon"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => navigate('/sorties')}
            className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary"
          >
            <Package className="w-4 h-4 mr-2" />
            Nouvelle Sortie
          </Button>
        </div>
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
              <AlertDescription className="flex items-center justify-between">
                <span><strong>{alert.title}:</strong> {alert.message}</span>
                <ArrowUpRight className="h-4 w-4" />
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Cards - Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Conteneurs Actifs"
          value={stats?.sorties?.en_cours ?? 0}
          description={`${stats?.sorties?.aujourd_hui ?? 0} sorties aujourd'hui`}
          icon={Package}
          variant="info"
        />
        <StatsCard
          title="Véhicules Disponibles"
          value={stats?.vehicules?.disponibles ?? 0}
          description={`Sur ${stats?.vehicules?.total ?? 0} véhicules`}
          icon={Truck}
          variant="success"
        />
        <StatsCard
          title="Détentions Actives"
          value={stats?.detentions?.actives ?? 0}
          description={formatCurrency(stats?.detentions?.montant_total ?? 0)}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Factures en Attente"
          value={stats?.facturations?.en_attente ?? 0}
          description={formatCurrency(stats?.facturations?.montant_en_attente ?? 0)}
          icon={CreditCard}
          variant="pending"
        />
      </div>

      {/* Résumé Sorties */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-muted to-background border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.sorties?.total ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total Sorties</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted to-background border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.sorties?.en_cours ?? 0}</p>
              <p className="text-xs text-muted-foreground">En Cours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted to-background border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.sorties?.retournees ?? 0}</p>
              <p className="text-xs text-muted-foreground">Retournées</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted to-background border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.sorties?.aujourd_hui ?? 0}</p>
              <p className="text-xs text-muted-foreground">Aujourd'hui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opérations Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              Opérations Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.operations?.en_cours ?? 0} en cours • {stats?.operations?.planifiees ?? 0} planifiées
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
              Terminées / Confirmées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.operations?.terminees ?? 0) + (stats?.operations?.confirmees ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats?.operations?.revenue_total ?? 0)} revenus
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-info">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-info" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations?.location ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats?.operations?.revenue_location ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-pending">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="w-4 h-4 mr-2 text-pending" />
              Transports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.operations?.transport ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats?.operations?.revenue_transport ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Armateurs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Ship className="w-4 h-4 mr-2 text-primary" />
              Armateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.armateurs?.actifs ?? 0}</span>
              <span className="text-muted-foreground text-sm">actifs</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground text-sm">{stats?.armateurs?.total ?? 0} total</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="w-4 h-4 mr-2 text-primary" />
              Flotte Véhicules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-2xl font-bold text-success">{stats?.vehicules?.disponibles ?? 0}</span>
                <span className="text-muted-foreground text-sm ml-1">dispo</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-warning">{stats?.vehicules?.maintenance ?? 0}</span>
                <span className="text-muted-foreground text-sm ml-1">maint.</span>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">{stats?.vehicules?.total ?? 0} total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <ActivityChart 
          sortiesParMois={charts?.sorties_par_mois ?? []}
          repartitionStatuts={charts?.repartition_statuts ?? []}
        />

        {/* Status Pie Chart */}
        <StatusPieChart data={charts?.repartition_statuts ?? []} />
      </div>

      {/* Top Armateurs and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Armateurs */}
        <TopArmateursChart data={charts?.top_armateurs ?? []} />

        {/* Recent Operations */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities && activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => {
                  const timeAgo = new Date(activity.timestamp).toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short'
                  });
                  
                  const colorClass = {
                    blue: 'bg-info',
                    green: 'bg-success',
                    orange: 'bg-warning',
                    red: 'bg-destructive',
                  }[activity.color] || 'bg-primary';
                  
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                        <div>
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
              onClick={() => navigate('/operations')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Nouvelle Opération</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/detentions')}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs">Détentions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/facturations')}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs">Facturations</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/materiel')}
            >
              <Truck className="w-6 h-6" />
              <span className="text-xs">Matériel</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => navigate('/armateurs')}
            >
              <Ship className="w-6 h-6" />
              <span className="text-xs">Armateurs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
