export interface FactureInterne {
  id: string;
  numeroFacture: string;
  dateFacture: string;
  typeOperation: "stockage" | "double_relevage" | "depotage";
  numeroConteneur: string;
  nomClient: string;
  montantAPayer: number;
  dateSortieOperation: string;
  statutPaiement: "brouillon" | "envoyee" | "payee" | "annulee";
  // Additional data for traceability
  joursGratuits?: number;
  joursPayants?: number;
  tarifJournalier?: number;
  montantTva?: number;
  montantTtc?: number;
  notes?: string;
  // Vehicule information
  camion?: string;
  remorque?: string;
  // Operation details
  detailsOperation?: {
    plaque_camion?: string;
    plaque_remorque?: string;
    jours_gratuits?: number;
    jours_detention?: number;
    prix_par_jour?: number;
    date_arrivee?: string;
    date_sortie?: string;
    camion_ameneur_plaque?: string;
    camion_ameneur_remorque?: string;
    camion_recuperateur_plaque?: string;
    camion_recuperateur_remorque?: string;
    montant_operation?: number;
    type_marchandise?: string;
    prix_depotage?: number;
    date_depotage?: string;
  };
}

export interface CreateFactureData {
  typeOperation: "stockage" | "double_relevage" | "depotage";
  numeroConteneur: string;
  nomClient: string;
  montantAPayer: number;
  dateSortieOperation: string;
  joursGratuits?: number;
  joursPayants?: number;
  tarifJournalier?: number;
}