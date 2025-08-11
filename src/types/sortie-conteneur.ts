export interface SortieConteneur {
  id: string;
  numeroConteneur: string;
  numeroVL: string;
  codeArmateur: string;
  camion: string;
  remorque: string;
  nomClient: string;
  destination: "base" | "client";
  adresseClient?: string;
  typeDestination: "bat" | "detention";
  joursBAT?: number;
  dateFinFranchise?: string;
  nomTransitaire: string;
  dateSortie: string;
  dateRetour?: string;
  statut: "en_cours" | "livre_client" | "a_la_base" | "retourne_port";
}

export interface SortieFormData {
  numeroConteneur: string;
  numeroVL: string;
  codeArmateur: string;
  camion: string;
  remorque: string;
  nomClient: string;
  destination: string;
  adresseClient: string;
  typeDestination: string;
  joursBAT: string;
  dateFinFranchise: string;
  nomTransitaire: string;
}

export interface ReturnData {
  dateRetour: string;
  camionRetour: string;
  remorqueRetour: string;
}