export interface ArchiveBase {
  id: string;
  typeOperation: "stockage" | "double-relevage";
  numeroConteneur: string;
  nomClient: string;
  provenance: string;
  dateArriveeBase: string;
  dateSortieBase: string;
  camionArrivee: string;
  remorqueArrivee: string;
  camionSortie?: string;
  remorqueSortie?: string;
  joursGratuits?: number;
  joursPayants?: number;
  montantTotalFacture: number;
  dateFacturation: string;
  numeroFacture: string;
  statutPaiement: "paye";
  dateArchivage: string;
}

export interface ArchiveFilters {
  dateDebut: string;
  dateFin: string;
  typeOperation: string;
  client: string;
  numeroConteneur: string;
  statutPaiement: string;
}

export const EXPORT_FORMATS = [
  { value: "excel", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF" }
] as const;