import { useState, useEffect } from 'react';
import { primeService } from '@/services/primeService';
import type { PrimeChauffeur, PrimeStats, UpdatePrimeData } from '@/types/prime';
import { useToast } from '@/hooks/use-toast';

export function usePrimes() {
  const { toast } = useToast();
  const [primes, setPrimes] = useState<PrimeChauffeur[]>([]);
  const [stats, setStats] = useState<PrimeStats>({
    total_primes: 0,
    montant_total: '0 FCFA',
    montant_en_cours: '0 FCFA',
    montant_paye: '0 FCFA',
    nombre_en_cours: 0,
    nombre_paye: 0
  });
  const [loading, setLoading] = useState(false);

  const loadPrimes = async () => {
    setLoading(true);
    try {
      const data = await primeService.getPrimes();
      setPrimes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des primes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les primes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await primeService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const updatePrime = async (sortieId: number, data: UpdatePrimeData) => {
    try {
      await primeService.updatePrime(sortieId, data);
      await loadPrimes();
      await loadStats();
      toast({
        title: "Succès",
        description: "Prime mise à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la prime",
        variant: "destructive"
      });
    }
  };

  const marquerCommePaye = async (sortieId: number) => {
    try {
      await primeService.marquerCommePaye(sortieId);
      await loadPrimes();
      await loadStats();
      toast({
        title: "Succès",
        description: "Prime marquée comme payée"
      });
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la prime comme payée",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPrimes();
    loadStats();
  }, []);

  return {
    primes,
    stats,
    loading,
    updatePrime,
    marquerCommePaye,
    refresh: () => {
      loadPrimes();
      loadStats();
    }
  };
}
