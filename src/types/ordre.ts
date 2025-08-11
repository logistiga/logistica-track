export interface OrdreOperation {
  id: string;
  typeOperation: string;
  dateExecution: string;
  camion: string;
  remorque: string;
  client: string;
  instructions: string;
  montant: number;
  numeroOrdre?: string;
  statut: "en-attente" | "valide";
}

export interface OrdreSortieStandard {
  id: string;
  numeroConteneur: string;
  typeConteneur: string;
  codeArmateur: string;
  nomClient: string;
  destination: string;
  dateSortie: string;
  pvSortie?: string;
  pvRentreePort?: string;
  numeroOrdre?: string;
  statut: "en-attente" | "valide";
}

export interface UpdateOrdreOperationData {
  id: string;
  numeroOrdre: string;
}

export interface UpdateOrdreSortieData {
  id: string;
  pvSortie: string;
  pvRentreePort: string;
  numeroOrdre: string;
}