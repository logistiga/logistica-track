import { apiService } from './apiService';
import type { PrimeChauffeur, PrimeStats, UpdatePrimeData } from '@/types/prime';

class PrimeService {
  // Récupérer toutes les primes
  async getPrimes(): Promise<PrimeChauffeur[]> {
    try {
      // Utiliser l'endpoint sorties pour récupérer les primes
      const response = await apiService.get('/sorties');
      
      // Mapper les sorties en primes de chauffeur
      const primes: PrimeChauffeur[] = response.data.map((sortie: any) => ({
        id: sortie.id,
        sortie_id: sortie.id,
        numero_conteneur: sortie.numero_conteneur,
        camion: sortie.camion?.libelle_complet || sortie.camion_id?.toString() || 'N/A',
        chauffeur: sortie.chauffeur_nom || '',
        date_sortie: sortie.date_sortie,
        date_retour: sortie.date_retour,
        montant_prime: parseFloat(sortie.prime_chauffeur || 0),
        montant_prime_formatte: sortie.prime_chauffeur_formattee || `${sortie.prime_chauffeur || 0} FCFA`,
        statut: sortie.date_retour ? 'retourne' : 'en_cours',
        statut_label: sortie.date_retour ? 'Retourné' : 'En cours',
        nom_client: sortie.nom_client,
        destination: sortie.destination,
        observations: sortie.observations
      }));

      return primes.filter(p => p.montant_prime > 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des primes:', error);
      return [];
    }
  }

  // Récupérer les statistiques des primes
  async getStats(): Promise<PrimeStats> {
    try {
      const primes = await this.getPrimes();
      
      const total = primes.length;
      const montantTotal = primes.reduce((sum, p) => sum + p.montant_prime, 0);
      const primesEnCours = primes.filter(p => p.statut === 'en_cours');
      const primesPaye = primes.filter(p => p.statut === 'paye');
      
      const montantEnCours = primesEnCours.reduce((sum, p) => sum + p.montant_prime, 0);
      const montantPaye = primesPaye.reduce((sum, p) => sum + p.montant_prime, 0);

      return {
        total_primes: total,
        montant_total: this.formatCurrency(montantTotal),
        montant_en_cours: this.formatCurrency(montantEnCours),
        montant_paye: this.formatCurrency(montantPaye),
        nombre_en_cours: primesEnCours.length,
        nombre_paye: primesPaye.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_primes: 0,
        montant_total: '0 FCFA',
        montant_en_cours: '0 FCFA',
        montant_paye: '0 FCFA',
        nombre_en_cours: 0,
        nombre_paye: 0
      };
    }
  }

  // Mettre à jour une prime
  async updatePrime(sortieId: number, data: UpdatePrimeData): Promise<PrimeChauffeur> {
    const response = await apiService.put(`/sorties/${sortieId}`, {
      prime_chauffeur: data.montant_prime,
      observations: data.observations
    });
    return response.data;
  }

  // Marquer une prime comme payée
  async marquerCommePaye(sortieId: number): Promise<void> {
    await apiService.put(`/sorties/${sortieId}`, {
      statut_prime: 'paye'
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  }
}

export const primeService = new PrimeService();
