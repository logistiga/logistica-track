export interface Notification {
  id: string;
  titre: string;
  description: string;
  dateHeure: string;
  type: "retard" | "rentree" | "alerte";
  lien?: string;
  pageSource?: string;
  lu: boolean;
  priorite: "normal" | "urgent";
}

export interface NotificationSettings {
  retards: {
    inApp: boolean;
    email: boolean;
  };
  rentrees: {
    inApp: boolean;
    email: boolean;
  };
  alertes: {
    inApp: boolean;
    email: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  nom: string;
  type: string;
  sujet: string;
  contenu: string;
  actif: boolean;
}

export interface EmailHistory {
  id: string;
  destinataire: string;
  sujet: string;
  dateEnvoi: string;
  statut: "envoye" | "echec" | "en-attente";
  template: string;
}

export interface EmailConfig {
  expediteurDefaut: string;
  serveurSMTP: string;
  port: number;
  ssl: boolean;
}