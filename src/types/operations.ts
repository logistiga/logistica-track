export interface Operation {
  id: string;
  typeOperation: "location" | "transport" | "double-relevage" | "logistique";
  
  // Dates
  dateDebut: string;
  dateFin?: string;
  duree?: number; // Durée en jours (calculée)
  
  // Véhicules
  camion: string;
  remorque: string;
  
  // Client
  client: string;
  
  // Tarification
  tarifJournalier?: number; // Pour location
  montant: number;
  
  // Spécifique Transport
  lieuDepart?: string;
  destination?: string;
  
  // Détails
  instructions: string;
  statut: "en-attente" | "en-cours" | "terminee" | "confirmee";
  
  dateCreation: string;
}

export interface CreateOperationData {
  typeOperation: "location" | "transport" | "double-relevage" | "logistique";
  dateDebut: string;
  dateFin?: string;
  camion: string;
  remorque: string;
  client: string;
  tarifJournalier?: number;
  montant?: number;
  lieuDepart?: string;
  destination?: string;
  instructions: string;
}

export const OPERATION_TYPES = [
  { value: "location", label: "Location" },
  { value: "transport", label: "Transport" },
  { value: "double-relevage", label: "Double relevage" },
  { value: "logistique", label: "Logistique" }
] as const;