export interface DetentionContainer {
  id: string;
  numeroConteneur: string;
  codeArmateur: string;
  typeConteneur: string;
  joursBAT: number;
  joursRealises: number;
  joursDepassement: number;
  dateSortie: string;
  dateRetour: string;
  nomClient: string;
  responsabilite?: "client" | "logistiga" | "partagee";
  joursClient?: number;
  joursLogistiga?: number;
  coutParJour: number;
  montantTotal: number;
  noteDebitGeneree: boolean;
  paiementConfirme: boolean;
}

export interface ResponsabiliteFormData {
  responsabilite: "client" | "logistiga" | "partagee";
  joursClient: number;
  joursLogistiga: number;
}