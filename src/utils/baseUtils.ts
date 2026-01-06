import { Badge } from "@/components/ui/badge";

// Types communs pour les véhicules
export interface VehiculeParc {
  id: string;
  numeroParc: string;
}

export interface VehiculeTransform {
  id: string;
  numeroParc: string;
  immatriculation: string;
  statut: string;
}

// Transformation des véhicules pour les formulaires
export function transformVehiculesToParc(vehicules: VehiculeTransform[]): VehiculeParc[] {
  return vehicules.map(v => ({ 
    id: v.id, 
    numeroParc: v.numeroParc 
  }));
}

// Labels de statut pour stockage
export const STOCKAGE_STATUS_CONFIG = {
  stocke: { label: "Stocké", variant: "success" as const, bgClass: "bg-success text-success-foreground" },
  en_attente_sortie: { label: "En attente sortie", variant: "warning" as const, bgClass: "bg-warning text-warning-foreground" },
  sorti: { label: "Sorti", variant: "secondary" as const, bgClass: "" }
} as const;

// Labels de statut pour dépotage
export const DEPOTAGE_STATUS_CONFIG = {
  en_cours: { label: "En cours", variant: "default" as const },
  termine: { label: "Terminé", variant: "secondary" as const },
  annule: { label: "Annulé", variant: "destructive" as const }
} as const;

// Labels de statut pour double relevage
export const DOUBLE_RELEVAGE_STATUS_CONFIG = {
  en_attente: { label: "En attente", variant: "warning" as const },
  confirme: { label: "Confirmé", variant: "success" as const },
  annule: { label: "Annulé", variant: "destructive" as const }
} as const;

export type StockageStatut = keyof typeof STOCKAGE_STATUS_CONFIG;
export type DepotageStatut = keyof typeof DEPOTAGE_STATUS_CONFIG;
export type DoubleRelevageStatut = keyof typeof DOUBLE_RELEVAGE_STATUS_CONFIG;

// Fonctions utilitaires pour obtenir les labels
export function getStockageStatusLabel(statut: string): string {
  return STOCKAGE_STATUS_CONFIG[statut as StockageStatut]?.label || statut;
}

export function getDepotageStatusLabel(statut: string): string {
  return DEPOTAGE_STATUS_CONFIG[statut as DepotageStatut]?.label || statut;
}

export function getDoubleRelevageStatusLabel(statut: string): string {
  return DOUBLE_RELEVAGE_STATUS_CONFIG[statut as DoubleRelevageStatut]?.label || statut;
}

// Formatage de date
export function formatDateFr(dateString: string): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
}

// Formatage de monnaie
export function formatFCFA(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '0 FCFA';
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}
