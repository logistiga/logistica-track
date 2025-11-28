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
  responsabilite?: "client" | "logistiga" | "partagee";
  joursClient?: number;
  joursLogistiga?: number;
  montantTotalDetention?: number;
  dateFacturationDetention?: string;
  numeroFactureDetention?: string;
  statutPaiement: "paye" | "sans-frais";
  montantPrime?: number;
  camion?: string;
  chauffeur?: string;
  numeroBL?: string;
  nomTransitaire?: string;
  observations?: string;
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