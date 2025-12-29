export interface Client {
  id: number;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  created_at: string;
  updated_at: string;
}

export interface Container {
  id: number;
  number: string;
  type: string; // 20GP, 40GP, 40HC, etc.
}

export interface LignePrestation {
  id: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export interface OrdreTravail {
  id: number;
  numero: string;
  client_id: number;
  client?: Client;
  date: string;
  type: string;
  status: "brouillon" | "en_cours" | "termine" | "facture";
  reference?: string;
  booking_number?: string;
  vessel_name?: string;
  containers: Container[];
  lignes_prestations: LignePrestation[];
  montant_total: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  numero: string;
  client_id: number;
  client?: Client;
  ordre_travail_id?: number;
  ordre_travail?: OrdreTravail;
  date_emission: string;
  date_echeance: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  status: "brouillon" | "envoyee" | "payee" | "annulee";
  created_at: string;
  updated_at: string;
}

export interface ApiStats {
  clients_count: number;
  ordres_travail_count: number;
  ordres_en_cours: number;
  invoices_count: number;
  chiffre_affaires_mois: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
