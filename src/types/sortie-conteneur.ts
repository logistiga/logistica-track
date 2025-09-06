export interface SortieConteneur {
  id: string;
  numeroConteneur: string;
  numeroBL: string;
  codeArmateur: string;
  camion: string;
  remorque: string;
  primeChauffeur: number;
  nomClient: string;
  destination: "base" | "client";
  adresseClient?: string;
  typeDestination: "bad" | "detention";
  joursBAD?: number;
  dateFinFranchise?: string;
  nomTransitaire: string;
  dateSortie: string;
  dateRetour?: string;
  statut: "en_cours" | "livre_client" | "a_la_base" | "retourne_port";
}

export interface SortieFormData {
  numeroConteneur: string;
  numeroBL: string;
  codeArmateur: string;
  camion: string;
  remorque: string;
  primeChauffeur: string;
  nomClient: string;
  destination: string;
  adresseClient: string;
  typeDestination: string;
  joursBAD: string;
  dateFinFranchise: string;
  nomTransitaire: string;
  dateSortie: string;
}

export interface ReturnData {
  dateRetour: string;
  camionRetour: string;
  remorqueRetour: string;
}