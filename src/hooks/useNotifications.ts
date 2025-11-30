import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

/**
 * Hook pour gérer les notifications de l'application
 */
export function useNotifications() {
  useEffect(() => {
    // Vérifier automatiquement le support des notifications au montage
    const isSupported = notificationService.isSupported();
    const isGranted = notificationService.isGranted();

    console.log('Notifications supportées:', isSupported);
    console.log('Permission accordée:', isGranted);
  }, []);

  return {
    // Méthodes de notification pour les sorties
    notifySortieCreated: (numeroConteneur: string) => 
      notificationService.notifySortieCreated(numeroConteneur),
    
    notifySortieReturned: (numeroConteneur: string) => 
      notificationService.notifySortieReturned(numeroConteneur),

    // Méthodes de notification pour les détentions
    notifyDetentionAlert: (numeroConteneur: string, jours: number) =>
      notificationService.notifyDetentionAlert(numeroConteneur, jours),

    // Méthodes de notification pour les opérations
    notifyOperationStarted: (operationType: string, numeroOperation: string) =>
      notificationService.notifyOperationStarted(operationType, numeroOperation),
    
    notifyOperationCompleted: (operationType: string, numeroOperation: string) =>
      notificationService.notifyOperationCompleted(operationType, numeroOperation),

    // Méthodes de notification pour la facturation
    notifyFactureCreated: (numeroFacture: string, montant: number) =>
      notificationService.notifyFactureCreated(numeroFacture, montant),

    // Méthodes de notification pour les primes
    notifyPrimePaid: (chauffeur: string, montant: number) =>
      notificationService.notifyPrimePaid(chauffeur, montant),

    // Méthodes de notification pour les véhicules
    notifyVehicleMaintenance: (immatriculation: string) =>
      notificationService.notifyVehicleMaintenance(immatriculation),

    // Notification générique
    sendNotification: (payload: { title: string; body: string; type: 'success' | 'warning' | 'error' | 'info'; data?: any }) =>
      notificationService.send(payload),

    // Utilitaires
    requestPermission: () => notificationService.requestPermission(),
    isSupported: () => notificationService.isSupported(),
    isGranted: () => notificationService.isGranted(),
  };
}
