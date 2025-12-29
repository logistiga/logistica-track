export interface PrimeChauffeur {
  id: number;
  numero_tc: string;
  immatriculation?: string;
  chauffeur?: string;
  date_sortie: string;
  date_retour?: string;
  prime_chauffeur: number;
  prime_formatted: string;
  statut_prime: 'en_attente' | 'paye';
  statut_prime_label: string;
  observations?: string;
  nom_client?: string;
  destination?: string;
}

export interface PrimeArchive {
  id: number;
  numero_tc: string;
  immatriculation?: string;
  chauffeur?: string;
  date_sortie: string;
  montant_prime: number;
  montant_formatted: string;
  observations?: string;
  date_paiement: string;
  numero_semaine: number;
}

export interface PrimeStats {
  total_primes: number;
  montant_total: number | string;
  montant_en_attente: number | string;
  montant_paye: number | string;
  nombre_en_attente?: number;
  nombre_paye?: number;
}

export interface CreatePrimeData {
  sortie_id: number;
  montant_prime: number;
  observations?: string;
}

export interface UpdatePrimeData {
  montant_prime?: number;
  statut?: 'en_cours' | 'retourne' | 'paye';
  observations?: string;
}
