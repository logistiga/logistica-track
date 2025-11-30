import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { toast } from '@/hooks/use-toast';

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const result = await notificationService.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez des alertes pour les événements importants",
        });

        // Envoyer une notification de test
        await notificationService.send({
          title: '🎉 Notifications activées !',
          body: 'Vous recevrez maintenant des alertes en temps réel',
          type: 'success'
        });
      } else {
        toast({
          title: "Permission refusée",
          description: "Vous ne recevrez pas de notifications",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive"
      });
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications non disponibles
          </CardTitle>
          <CardDescription>
            Votre navigateur ne supporte pas les notifications push
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (permission === 'granted') {
    return (
      <Card className="border-success/50 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <Check className="h-5 w-5" />
            Notifications activées
          </CardTitle>
          <CardDescription>
            Vous recevez des alertes pour les événements importants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ Nouvelles sorties de conteneurs</p>
            <p>✅ Retours au port</p>
            <p>✅ Alertes de détention</p>
            <p>✅ Opérations terminées</p>
            <p>✅ Nouvelles factures</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <X className="h-5 w-5" />
            Notifications bloquées
          </CardTitle>
          <CardDescription>
            Vous avez refusé les notifications. Pour les réactiver, modifiez les paramètres de votre navigateur.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Activer les notifications
        </CardTitle>
        <CardDescription>
          Recevez des alertes en temps réel pour les événements importants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Nouvelles sorties et retours de conteneurs</p>
          <p>• Alertes de détention dépassée</p>
          <p>• Changements de statut d'opérations</p>
          <p>• Nouvelles factures et primes payées</p>
          <p>• Alertes de maintenance véhicule</p>
        </div>
        <Button onClick={handleRequestPermission} className="w-full">
          <Bell className="h-4 w-4 mr-2" />
          Activer les notifications
        </Button>
      </CardContent>
    </Card>
  );
}
