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