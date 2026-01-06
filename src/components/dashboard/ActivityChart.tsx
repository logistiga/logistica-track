import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface ActivityChartProps {
  sortiesParMois?: Array<{ mois: number; total: number }>;
  repartitionStatuts?: Array<{ statut: string; count: number }>;
}

const chartConfig = {
  total: {
    label: "Sorties",
    color: "hsl(var(--primary))",
  },
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
  'hsl(var(--pending))',
];

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const STATUS_LABELS: Record<string, string> = {
  'en_cours': 'En cours',
  'retourne_port': 'Retourné',
  'termine': 'Terminé',
  'annule': 'Annulé',
  'planifie': 'Planifié',
};

export function ActivityChart({ sortiesParMois = [], repartitionStatuts = [] }: ActivityChartProps) {
  // Préparer les données pour le graphique mensuel
  const monthlyData = sortiesParMois.map(item => ({
    mois: MONTHS[item.mois - 1] || `Mois ${item.mois}`,
    total: item.total,
  }));

  // Données par défaut si vide
  const displayData = monthlyData.length > 0 ? monthlyData : [
    { mois: 'Jan', total: 0 },
    { mois: 'Fév', total: 0 },
    { mois: 'Mar', total: 0 },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Sorties par Mois
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={displayData}>
            <XAxis 
              dataKey="mois" 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis 
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="total" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function StatusPieChart({ data = [] }: { data: Array<{ statut: string; count: number }> }) {
  const pieData = data.map(item => ({
    name: STATUS_LABELS[item.statut] || item.statut,
    value: item.count,
  }));

  if (pieData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Répartition par Statut</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground">Aucune donnée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">Répartition par Statut</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopArmateursChart({ data = [] }: { data: Array<{ nom: string; sorties: number }> }) {
  if (data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">Top Armateurs</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground">Aucune donnée</p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.sorties));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">Top 5 Armateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.nom} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium truncate max-w-[150px]">{item.nom}</span>
                <span className="text-muted-foreground">{item.sorties}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${(item.sorties / maxValue) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
