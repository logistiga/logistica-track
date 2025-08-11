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
  responsabilite?: "client" | "logistica" | "partagee";
  joursClient?: number;
  joursLogistica?: number;
  noteDebitGeneree: boolean;
  paiementConfirme: boolean;
}

export interface ResponsabiliteFormData {
  responsabilite: "client" | "logistica" | "partagee";
  joursClient: number;
  joursLogistica: number;
}