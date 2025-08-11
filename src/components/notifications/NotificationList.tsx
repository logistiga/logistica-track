import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Mail, ExternalLink, Eye } from "lucide-react";
import { Notification } from "@/types/notifications";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (lien: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead, onNavigate }: NotificationListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "retard":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "rentree":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "alerte":
        return <Mail className="w-4 h-4 text-blue-500" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string, priorite: string) => {
    const isUrgent = priorite === "urgent";
    
    switch (type) {
      case "retard":
        return <Badge variant={isUrgent ? "destructive" : "outline"}>Retard</Badge>;
      case "rentree":
        return <Badge variant={isUrgent ? "destructive" : "default"}>Rentrée</Badge>;
      case "alerte":
        return <Badge variant={isUrgent ? "destructive" : "secondary"}>Alerte</Badge>;
      default:
        return <Badge variant="outline">Notification</Badge>;
    }
  };

  const formatDate = (dateHeure: string) => {
    return new Date(dateHeure).toLocaleString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications récentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg space-y-2 ${
                !notification.lu ? "bg-muted/50 border-primary/20" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(notification.type)}
                  <h3 className="font-medium">{notification.titre}</h3>
                  {getTypeBadge(notification.type, notification.priorite)}
                  {!notification.lu && (
                    <Badge variant="outline" className="text-xs">
                      Nouveau
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!notification.lu && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  {notification.lien && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(notification.lien!)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{formatDate(notification.dateHeure)}</span>
                {notification.pageSource && (
                  <span>Source: {notification.pageSource}</span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}