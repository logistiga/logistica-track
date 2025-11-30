type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface NotificationPayload {
  title: string;
  body: string;
  type: NotificationType;
  data?: any;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Demander la permission pour les notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Les notifications ne sont pas supportées par ce navigateur');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission;
  }

  /**
   * Vérifier si les notifications sont supportées et autorisées
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Vérifier si l'utilisateur a accordé la permission
   */
  isGranted(): boolean {
    return this.permission === 'granted';
  }

  /**
   * Envoyer une notification
   */
  async send({ title, body, type, data }: NotificationPayload): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications non supportées');
      return;
    }

    // Demander la permission si nécessaire
    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Permission de notification refusée');
        return;
      }
    }

    // Icône selon le type
    const icon = this.getIconForType(type);

    // Options de la notification
    const options: NotificationOptions = {
      body,
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data,
      tag: `notification-${Date.now()}`,
      requireInteraction: type === 'error' || type === 'warning',
    };

    // Créer la notification
    try {
      const notification = new Notification(title, options);

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();

        // Naviguer vers la page appropriée si des données sont fournies
        if (data?.url) {
          window.location.href = data.url;
        }
      };

      // Fermer automatiquement après 5 secondes (sauf erreur/warning)
      if (type !== 'error' && type !== 'warning') {
        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  /**
   * Notifications prédéfinies pour les événements métier
   */
  async notifySortieCreated(numeroConteneur: string): Promise<void> {
    await this.send({
      title: '✅ Sortie Conteneur Créée',
      body: `Le conteneur ${numeroConteneur} a été enregistré`,
      type: 'success',
      data: { url: '/sorties' }
    });
  }

  async notifySortieReturned(numeroConteneur: string): Promise<void> {
    await this.send({
      title: '🚛 Conteneur Retourné',
      body: `Le conteneur ${numeroConteneur} est retourné au port`,
      type: 'info',
      data: { url: '/sorties' }
    });
  }

  async notifyDetentionAlert(numeroConteneur: string, jours: number): Promise<void> {
    await this.send({
      title: '⚠️ Alerte Détention',
      body: `Conteneur ${numeroConteneur} : ${jours} jours de détention`,
      type: 'warning',
      data: { url: '/detention' }
    });
  }

  async notifyOperationStarted(operationType: string, numeroOperation: string): Promise<void> {
    await this.send({
      title: '▶️ Opération Démarrée',
      body: `${operationType} ${numeroOperation} a commencé`,
      type: 'info',
      data: { url: '/operations' }
    });
  }

  async notifyOperationCompleted(operationType: string, numeroOperation: string): Promise<void> {
    await this.send({
      title: '✅ Opération Terminée',
      body: `${operationType} ${numeroOperation} est terminée`,
      type: 'success',
      data: { url: '/operations' }
    });
  }

  async notifyFactureCreated(numeroFacture: string, montant: number): Promise<void> {
    await this.send({
      title: '💰 Nouvelle Facture',
      body: `Facture ${numeroFacture} créée : ${montant.toLocaleString('fr-FR')} FCFA`,
      type: 'info',
      data: { url: '/facturation' }
    });
  }

  async notifyPrimePaid(chauffeur: string, montant: number): Promise<void> {
    await this.send({
      title: '💵 Prime Payée',
      body: `Prime de ${montant.toLocaleString('fr-FR')} FCFA versée à ${chauffeur}`,
      type: 'success',
      data: { url: '/primes' }
    });
  }

  async notifyVehicleMaintenance(immatriculation: string): Promise<void> {
    await this.send({
      title: '🔧 Maintenance Véhicule',
      body: `Le véhicule ${immatriculation} nécessite une révision`,
      type: 'warning',
      data: { url: '/materiel' }
    });
  }

  private getIconForType(type: NotificationType): string {
    const icons = {
      success: '/pwa-192x192.png',
      warning: '/pwa-192x192.png',
      error: '/pwa-192x192.png',
      info: '/pwa-192x192.png',
    };
    return icons[type];
  }
}

export const notificationService = new NotificationService();
