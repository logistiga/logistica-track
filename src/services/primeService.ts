import { apiService } from './apiService';
import type { PrimeChauffeur, PrimeArchive, PrimeStats, UpdatePrimeData } from '@/types/prime';

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
      const data = response.data;
      
      // Calculer les nombres à partir des primes réelles
      const primes = await this.getPrimes();
      const nombre_en_attente = primes.filter(p => p.statut_prime === 'en_attente').length;
      const nombre_paye = primes.filter(p => p.statut_prime === 'paye').length;
      
      return {
        ...data,
        nombre_en_attente,
        nombre_paye
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_primes: 0,
        montant_total: '0 FCFA',
        montant_en_attente: '0 FCFA',
        montant_paye: '0 FCFA',
        nombre_en_attente: 0,
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

  // Payer plusieurs primes en lot
  async payerEnLot(sortieIds: number[]): Promise<any> {
    const response = await apiService.post('/primes/payer-en-lot', {
      sortie_ids: sortieIds
    });
    return response.data;
  }

  // Récupérer les archives
  async getArchives(): Promise<PrimeArchive[]> {
    try {
      const response = await apiService.get('/primes/archives');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des archives:', error);
      return [];
    }
  }

  // Récupérer les statistiques des archives
  async getArchiveStats(): Promise<any> {
    try {
      const response = await apiService.get('/primes/archives/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats archives:', error);
      return {
        total_archives: 0,
        montant_total: '0 FCFA',
        par_semaine: {}
      };
    }
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
