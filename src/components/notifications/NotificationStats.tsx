import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Notification } from "@/types/notifications";

interface NotificationStatsProps {
  notifications: Notification[];
}

export function NotificationStats({ notifications }: NotificationStatsProps) {
  const nonLues = notifications.filter(n => !n.lu);
  const retards = notifications.filter(n => n.type === "retard");
  const alertes = notifications.filter(n => n.type === "alerte");
  const rentrees = notifications.filter(n => n.type === "rentree");

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Non lues</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nonLues.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retards</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{retards.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rentrées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rentrees.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertes</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertes.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}