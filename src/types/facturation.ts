export interface FactureInterne {
  id: string;
  numeroFacture: string;
  dateFacture: string;
  typeOperation: "stockage" | "double-relevage";
  numeroConteneur: string;
  nomClient: string;
  montantAPayer: number;
  dateSortieOperation: string;
  statutPaiement: "en-attente" | "paye";
  // Additional data for traceability
  joursGratuits?: number;
  joursPayants?: number;
  tarifJournalier?: number;
}

export interface CreateFactureData {
  typeOperation: "stockage" | "double-relevage";
  numeroConteneur: string;
  nomClient: string;
  montantAPayer: number;
  dateSortieOperation: string;
  joursGratuits?: number;
  joursPayants?: number;
  tarifJournalier?: number;
}