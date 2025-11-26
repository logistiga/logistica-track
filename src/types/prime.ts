export interface PrimeChauffeur {
  id: number;
  sortie_id: number;
  numero_conteneur: string;
  camion: string;
  chauffeur?: string;
  date_sortie: string;
  date_retour?: string;
  montant_prime: number;
  montant_prime_formatte: string;
  statut: 'en_cours' | 'retourne' | 'paye';
  statut_label: string;
  nom_client: string;
  destination: string;
  observations?: string;
}

export interface PrimeStats {
  total_primes: number;
  montant_total: string;
  montant_en_cours: string;
  montant_paye: string;
  nombre_en_cours: number;
  nombre_paye: number;
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
