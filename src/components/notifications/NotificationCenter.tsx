import { useState, useEffect } from "react";
import { Bell, X, Eye, AlertTriangle, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@/types/notifications";

// Mock notifications - replace with real data
const mockNotifications: Notification[] = [
  {
    id: "1",
    titre: "Retard de livraison",
    description: "Conteneur MSKU1234567 en retard de 2h",
    dateHeure: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: "retard",
    lien: "/sorties",
    pageSource: "SortieConteneur",
    lu: false,
    priorite: "urgent"
  },
  {
    id: "2", 
    titre: "Nouvelle sortie enregistrée",
    description: "Conteneur HLXU9876543 prêt pour livraison",
    dateHeure: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: "rentree",
    lien: "/operations",
    pageSource: "Operations",
    lu: false,
    priorite: "normal"
  },
  {
    id: "3",
    titre: "Détention prolongée",
    description: "Conteneur TCLU4567890 - franchise dépassée",
    dateHeure: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: "alerte",
    lien: "/detention",
    pageSource: "Detention",
    lu: true,
    priorite: "urgent"
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.lu).length;

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          titre: "Nouvelle alerte système",
          description: "Vérification automatique détectée",
          dateHeure: new Date().toISOString(),
          type: "alerte",
          lu: false,
          priorite: "normal"
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        
        toast({
          title: newNotification.titre,
          description: newNotification.description,
          variant: "default"
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lu: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "retard": return <Clock className="w-4 h-4 text-warning" />;
      case "rentree": return <Package className="w-4 h-4 text-info" />;
      case "alerte": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="h-auto p-1 text-xs"
                >
                  Tout marquer lu
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                        !notification.lu ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium truncate">
                                {notification.titre}
                              </h4>
                              {notification.priorite === "urgent" && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimeAgo(notification.dateHeure)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.lu && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}