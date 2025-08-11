import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EmailConfig } from "@/types/notifications";
import { useToast } from "@/hooks/use-toast";

interface EmailConfigCardProps {
  config: EmailConfig;
  onUpdate: (config: EmailConfig) => void;
}

export function EmailConfigCard({ config, onUpdate }: EmailConfigCardProps) {
  const { toast } = useToast();
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onUpdate(localConfig);
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres e-mail ont été mis à jour."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration e-mail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="expediteur">Adresse expéditrice par défaut</Label>
          <Input
            id="expediteur"
            type="email"
            value={localConfig.expediteurDefaut}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, expediteurDefaut: e.target.value }))}
            placeholder="notifications@logistica.com"
          />
        </div>

        <div>
          <Label htmlFor="serveur">Serveur SMTP</Label>
          <Input
            id="serveur"
            value={localConfig.serveurSMTP}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, serveurSMTP: e.target.value }))}
            placeholder="smtp.gmail.com"
          />
        </div>

        <div>
          <Label htmlFor="port">Port SMTP</Label>
          <Input
            id="port"
            type="number"
            value={localConfig.port}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
            placeholder="587"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="ssl">Utiliser SSL/TLS</Label>
          <Switch
            id="ssl"
            checked={localConfig.ssl}
            onCheckedChange={(value) => setLocalConfig(prev => ({ ...prev, ssl: value }))}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder la configuration
        </Button>
      </CardContent>
    </Card>
  );
}