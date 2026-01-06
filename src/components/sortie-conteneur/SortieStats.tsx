import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { SortieConteneur } from "@/types/sortie-conteneur";

interface SortieStatsProps {
  sorties: SortieConteneur[];
}

export const SortieStats = ({ sorties }: SortieStatsProps) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Nombre de conteneurs hors port (en cours)
  const conteneurshorsPort = sorties.filter(
    sortie => sortie.statut !== "retourne_port"
  ).length;

  // Nombre de conteneurs sortis aujourd'hui
  const conteneursSortisAujourdhui = sorties.filter(
    sortie => sortie.dateSortie === today
  ).length;

  // Nombre total de sorties du mois en cours
  const conteneursDuMois = sorties.filter(sortie => {
    const sortieDate = new Date(sortie.dateSortie);
    return sortieDate.getMonth() === currentMonth && 
           sortieDate.getFullYear() === currentYear;
  }).length;

  // Nombre de retours du mois
  const retoursDuMois = sorties.filter(sortie => {
    if (!sortie.dateRetour) return false;
    const retourDate = new Date(sortie.dateRetour);
    return retourDate.getMonth() === currentMonth && 
           retourDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    {
      title: "Conteneurs Hors Port",
      value: conteneurshorsPort,
      description: "En cours de livraison",
      icon: Package,
      color: "text-info",
      bgColor: "bg-info-light",
      iconColor: "text-info"
    },
    {
      title: "Sorties Aujourd'hui",
      value: conteneursSortisAujourdhui,
      description: `Sortis le ${new Date().toLocaleDateString('fr-FR')}`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success-light",
      iconColor: "text-success"
    },
    {
      title: "Total du Mois",
      value: conteneursDuMois,
      description: `${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary-light",
      iconColor: "text-primary"
    },
    {
      title: "Retours du Mois",
      value: retoursDuMois,
      description: "Conteneurs retournés au port",
      icon: BarChart3,
      color: "text-warning",
      bgColor: "bg-warning-light",
      iconColor: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    conteneurs
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};