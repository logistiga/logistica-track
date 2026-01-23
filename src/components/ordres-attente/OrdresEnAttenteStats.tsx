import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, Package } from "lucide-react";

interface OrdresEnAttenteStatsProps {
  ordresEnAttente: number;
  ordresValides: number;
  totalConteneurs: number;
}

export function OrdresEnAttenteStats({ 
  ordresEnAttente, 
  ordresValides, 
  totalConteneurs 
}: OrdresEnAttenteStatsProps) {
  const stats = [
    {
      title: "En attente",
      value: ordresEnAttente,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Validés",
      value: ordresValides,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Conteneurs",
      value: totalConteneurs,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
