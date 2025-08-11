export interface ArchiveSortie {
  id: string;
  numeroConteneur: string;
  codeArmateur: string;
  typeConteneur: string;
  nomClient: string;
  dateSortiePort: string;
  dateRetourPort: string;
  destinationInitiale: "Client" | "Base";
  joursBAT: number;
  joursRealises: number;
  joursDepassement: number;
  responsabilite?: "client" | "logistica" | "partagee";
  joursClient?: number;
  joursLogistica?: number;
  montantTotalDetention?: number;
  dateFacturationDetention?: string;
  numeroFactureDetention?: string;
  statutPaiement: "paye" | "sans-frais";
  pvSortie?: string;
  pvRentreePort?: string;
  numeroOrdre?: string;
  dateArchivage: string;
}

export interface ArchiveSortieFilters {
  dateDebut: string;
  dateFin: string;
  armateur: string;
  client: string;
  numeroConteneur: string;
  statutPaiement: string;
}

export const EXPORT_FORMATS = [
  { value: "excel", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF" }
] as const;