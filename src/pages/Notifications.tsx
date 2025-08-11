import { useState } from "react";
import { Notification, NotificationSettings } from "@/types/notifications";
import { NotificationStats } from "@/components/notifications/NotificationStats";
import { NotificationList } from "@/components/notifications/NotificationList";
import { NotificationSettingsCard } from "@/components/notifications/NotificationSettingsCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      titre: "Conteneur CONT001 en retard",
      description: "Le conteneur CONT001 a dépassé sa franchise de 3 jours",
      dateHeure: "2024-01-15T14:30:00",
      type: "retard",
      lien: "/detention",
      pageSource: "Détention",
      lu: false,
      priorite: "urgent"
    },
    {
      id: "2",
      titre: "Opération de transport confirmée",
      description: "L'opération ORD-2024-001 a été validée et envoyée en archives",
      dateHeure: "2024-01-15T12:15:00",
      type: "rentree",
      lien: "/ordres",
      pageSource: "Ordres",
      lu: false,
      priorite: "normal"
    },
    {
      id: "3",
      titre: "Facture générée",
      description: "Facture FACT-2024-001 générée pour le stockage du conteneur CONT003",
      dateHeure: "2024-01-15T10:00:00",
      type: "alerte",
      lien: "/facturation",
      pageSource: "Facturation",
      lu: true,
      priorite: "normal"
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    retards: { inApp: true, email: true },
    rentrees: { inApp: true, email: false },
    alertes: { inApp: true, email: true }
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, lu: true } : notification
      )
    );
    toast({
      title: "Notification marquée comme lue",
      description: "La notification a été mise à jour."
    });
  };

  const handleNavigate = (lien: string) => {
    navigate(lien);
  };

  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Centre de notifications pour tous les événements importants
        </p>
      </div>

      <NotificationStats notifications={notifications} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onNavigate={handleNavigate}
          />
        </div>
        <div>
          <NotificationSettingsCard
            settings={settings}
            onUpdate={handleUpdateSettings}
          />
        </div>
      </div>
    </div>
  );
}