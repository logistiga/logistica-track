import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = [
  { day: "Lun", sorties: 12, retours: 8, detentions: 3 },
  { day: "Mar", sorties: 15, retours: 10, detentions: 2 },
  { day: "Mer", sorties: 18, retours: 12, detentions: 4 },
  { day: "Jeu", sorties: 14, retours: 9, detentions: 1 },
  { day: "Ven", sorties: 22, retours: 15, detentions: 5 },
  { day: "Sam", sorties: 8, retours: 6, detentions: 2 },
  { day: "Dim", sorties: 5, retours: 4, detentions: 1 },
];

const chartConfig = {
  sorties: {
    label: "Sorties",
    color: "hsl(var(--primary))",
  },
  retours: {
    label: "Retours", 
    color: "hsl(var(--info))",
  },
  detentions: {
    label: "Détentions",
    color: "hsl(var(--warning))",
  },
};

export function ActivityChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Activité des 7 Derniers Jours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="day" 
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
              dataKey="sorties" 
              fill="var(--color-sorties)" 
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar 
              dataKey="retours" 
              fill="var(--color-retours)" 
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar 
              dataKey="detentions" 
              fill="var(--color-detentions)" 
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}