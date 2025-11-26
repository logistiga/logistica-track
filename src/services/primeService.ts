import { apiService } from './apiService';
import type { PrimeChauffeur, PrimeStats, UpdatePrimeData } from '@/types/prime';

class PrimeService {
  // Récupérer toutes les primes
  async getPrimes(): Promise<PrimeChauffeur[]> {
    try {
      const response = await apiService.get('/primes');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des primes:', error);
      return [];
    }
  }

  // Récupérer les statistiques des primes
  async getStats(): Promise<PrimeStats> {
    try {
      const response = await apiService.get('/primes/stats');
      return response.data;
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
    const response = await apiService.put(`/primes/${sortieId}`, {
      prime_chauffeur: data.montant_prime,
      observations: data.observations
    });
    return response.data;
  }

  // Marquer une prime comme payée
  async marquerCommePaye(sortieId: number): Promise<void> {
    await apiService.post(`/primes/${sortieId}/marquer-paye`, {});
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
