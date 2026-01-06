import { format, addDays, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export interface DetentionStatus {
  joursRestants: number;
  dateLimite: Date;
  isRetard: boolean;
  isUrgent: boolean;
  isDernierJour: boolean;
  isOk: boolean;
  coutDetention: number;
}

/**
 * Calcule la date limite de retour basée sur la date de sortie et les jours gratuits
 */
export function calculateDateLimite(
  dateSortie: Date | string,
  joursGratuits: number,
  dateFinFranchiseOverride?: string
): Date {
  if (dateFinFranchiseOverride) {
    return new Date(dateFinFranchiseOverride);
  }
  
  const sortieDate = typeof dateSortie === 'string' ? new Date(dateSortie) : dateSortie;
  return addDays(sortieDate, joursGratuits);
}

/**
 * Calcule le statut de détention complet
 */
export function calculateDetentionStatus(
  dateSortie: Date | string,
  joursGratuits: number,
  prixParJour: number,
  dateFinFranchiseOverride?: string
): DetentionStatus {
  const dateLimite = calculateDateLimite(dateSortie, joursGratuits, dateFinFranchiseOverride);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dateLimiteNormalized = new Date(dateLimite);
  dateLimiteNormalized.setHours(0, 0, 0, 0);
  
  const joursRestants = differenceInDays(dateLimiteNormalized, today);
  
  const isRetard = joursRestants < 0;
  const isDernierJour = joursRestants === 0;
  const isUrgent = joursRestants > 0 && joursRestants <= 2;
  const isOk = joursRestants > 2;
  
  const joursDetention = isRetard ? Math.abs(joursRestants) : 0;
  const coutDetention = joursDetention * prixParJour;
  
  return {
    joursRestants,
    dateLimite,
    isRetard,
    isUrgent,
    isDernierJour,
    isOk,
    coutDetention
  };
}

/**
 * Formate la date limite pour affichage
 */
export function formatDateLimite(date: Date, formatString: string = "dd MMMM yyyy"): string {
  return format(date, formatString, { locale: fr });
}

/**
 * Formate la date limite courte (dd/MM)
 */
export function formatDateLimiteShort(date: Date): string {
  return format(date, "dd/MM", { locale: fr });
}

/**
 * Retourne le message d'alerte approprié selon le statut
 */
export function getDetentionAlertMessage(status: DetentionStatus, prixParJour: number): {
  type: 'error' | 'warning' | 'success';
  icon: string;
  title: string;
  message: string;
} {
  if (status.isRetard) {
    return {
      type: 'error',
      icon: '⚠️',
      title: 'RETARD',
      message: `${Math.abs(status.joursRestants)} jour(s) de retard - Coût détention: ${status.coutDetention.toLocaleString()} FCFA`
    };
  }
  
  if (status.isDernierJour) {
    return {
      type: 'warning',
      icon: '🟡',
      title: 'ATTENTION',
      message: 'Dernier jour de franchise'
    };
  }
  
  if (status.isUrgent) {
    return {
      type: 'warning',
      icon: '⏰',
      title: 'URGENT',
      message: `Plus que ${status.joursRestants} jour(s) avant détention`
    };
  }
  
  return {
    type: 'success',
    icon: '✅',
    title: 'OK',
    message: `Encore ${status.joursRestants} jour(s) de franchise`
  };
}
