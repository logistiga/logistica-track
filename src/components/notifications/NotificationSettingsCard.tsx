import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NotificationSettings } from "@/types/notifications";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsCardProps {
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
}

export function NotificationSettingsCard({ settings, onUpdate }: NotificationSettingsCardProps) {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };

  const updateSetting = (
    type: keyof NotificationSettings,
    method: "inApp" | "email",
    value: boolean
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [method]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Retards</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="retards-app">Dans l'application</Label>
            <Switch
              id="retards-app"
              checked={localSettings.retards.inApp}
              onCheckedChange={(value) => updateSetting("retards", "inApp", value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="retards-email">Par e-mail</Label>
            <Switch
              id="retards-email"
              checked={localSettings.retards.email}
              onCheckedChange={(value) => updateSetting("retards", "email", value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Rentrées de points</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="rentrees-app">Dans l'application</Label>
            <Switch
              id="rentrees-app"
              checked={localSettings.rentrees.inApp}
              onCheckedChange={(value) => updateSetting("rentrees", "inApp", value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="rentrees-email">Par e-mail</Label>
            <Switch
              id="rentrees-email"
              checked={localSettings.rentrees.email}
              onCheckedChange={(value) => updateSetting("rentrees", "email", value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Alertes spécifiques</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="alertes-app">Dans l'application</Label>
            <Switch
              id="alertes-app"
              checked={localSettings.alertes.inApp}
              onCheckedChange={(value) => updateSetting("alertes", "inApp", value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="alertes-email">Par e-mail</Label>
            <Switch
              id="alertes-email"
              checked={localSettings.alertes.email}
              onCheckedChange={(value) => updateSetting("alertes", "email", value)}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les paramètres
        </Button>
      </CardContent>
    </Card>
  );
}