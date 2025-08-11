import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "info" | "pending";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  default: "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground",
  success: "bg-gradient-to-br from-success to-success/80 text-success-foreground",
  warning: "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground",
  info: "bg-gradient-to-br from-info to-info/80 text-info-foreground",
  pending: "bg-gradient-to-br from-pending to-pending/80 text-pending-foreground",
};

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = "default",
  trend 
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        <div className={cn("p-6", variantStyles[variant])}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium opacity-90">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {description && (
                <p className="text-sm opacity-75">{description}</p>
              )}
              {trend && (
                <div className="flex items-center text-xs opacity-75">
                  <span className={cn(
                    "font-medium",
                    trend.isPositive ? "text-green-200" : "text-red-200"
                  )}>
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </span>
                  <span className="ml-1">vs mois dernier</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Icon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}