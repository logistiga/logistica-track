// PDF Generation Constants
export const PDF_CONFIG = {
  // Page settings
  PAGE: {
    FORMAT: 'a4' as const,
    ORIENTATION: 'portrait' as const,
    MARGINS: { left: 20, right: 20, top: 20, bottom: 20 },
  },
  
  // Colors (HSL format for consistency)
  COLORS: {
    PRIMARY: '#2563eb',
    SUCCESS: '#16a34a', 
    DANGER: '#dc2626',
    WARNING: '#ea580c',
    BACKGROUND: '#f8fafc',
    BORDER: '#e2e8f0',
    TEXT: {
      PRIMARY: '#0f172a',
      SECONDARY: '#64748b',
      MUTED: '#94a3b8',
    },
  },
  
  // Typography
  FONTS: {
    PRIMARY: 'helvetica',
    SIZES: {
      TITLE: 16,
      SUBTITLE: 14,
      HEADING: 12,
      BODY: 10,
      CAPTION: 8,
      SMALL: 7,
    },
  },
  
  // Layout dimensions
  LAYOUT: {
    CARD_HEIGHT: 45,
    SECTION_SPACING: 15,
    LINE_HEIGHT: 7,
    TIMELINE_HEIGHT: 25,
    COLUMN_WIDTHS: {
      LABEL: 100,
      VALUE: 80,
    },
  },
} as const;

// Company information
export const COMPANY_INFO = {
  name: 'LOGISTIGA TRANSIT',
  address: 'Abidjan, Côte d\'Ivoire',
  phone: '+225 XX XX XX XX',
  email: 'contact@logistiga.ci',
} as const;

// PDF Text constants
export const PDF_TEXTS = {
  DOCUMENT_TITLE: 'NOTE DE DÉBIT',
  SECTIONS: {
    CONTAINER: 'CONTENEUR & CLIENT',
    TIMELINE: 'CHRONOLOGIE',
    ANALYSIS: 'ANALYSE DE LA DÉTENTION', 
    CALCULATION: 'CALCUL DU MONTANT',
    BREAKDOWN: 'RÉPARTITION',
  },
  LABELS: {
    CONTAINER_NUMBER: 'Numéro conteneur:',
    SHIPPING_LINE: 'Ligne maritime:',
    CONTAINER_TYPE: 'Type conteneur:',
    CLIENT_NAME: 'Nom client:',
    EXIT_DATE: 'Date sortie:',
    RETURN_DATE: 'Date retour:',
    TOTAL_DURATION: 'Durée totale hors port:',
    EXCESS_BILLED: 'Dépassement facturé:',
    DAILY_COST: 'Coût journalier:',
    RESPONSIBILITY: 'Responsabilité:',
    BASE_CALCULATION: 'Calcul de base:',
    SUBTOTAL: 'Sous-total:',
    TOTAL_TO_PAY: 'TOTAL À PAYER:',
  },
} as const;