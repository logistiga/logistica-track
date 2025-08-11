export interface ArchiveOperation {
  id: string;
  typeOperation: "location" | "transport" | "double-relevage" | "logistique";
  numeroOperation: string;
  dateExecution: string;
  camion: string;
  remorque: string;
  client: string;
  instructions: string;
  montantTotal: number;
  dateFacturation: string;
  numeroFacture: string;
  statutPaiement: "paye";
  dateArchivage: string;
}

export interface ArchiveOperationFilters {
  dateDebut: string;
  dateFin: string;
  typeOperation: string;
  client: string;
  numeroOperation: string;
  statutPaiement: string;
}

export const EXPORT_FORMATS = [
  { value: "excel", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF" }
] as const;