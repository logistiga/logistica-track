export interface Operation {
  id: string;
  typeOperation: "location" | "transport" | "double-relevage" | "logistique";
  dateExecution: string;
  camion: string;
  remorque: string;
  client: string;
  instructions: string;
  montant: number;
  statut: "en-attente" | "confirmee";
  dateCreation: string;
}

export interface CreateOperationData {
  typeOperation: "location" | "transport" | "double-relevage" | "logistique";
  dateExecution: string;
  camion: string;
  remorque: string;
  client: string;
  instructions: string;
  montant: number;
}

export const OPERATION_TYPES = [
  { value: "location", label: "Location" },
  { value: "transport", label: "Transport" },
  { value: "double-relevage", label: "Double relevage" },
  { value: "logistique", label: "Logistique" }
] as const;