import { useState, useEffect } from 'react';
import { primeService } from '@/services/primeService';
import type { PrimeChauffeur, PrimeArchive, PrimeStats, UpdatePrimeData } from '@/types/prime';
import { useToast } from '@/hooks/use-toast';

export function usePrimes() {
  const { toast } = useToast();
  const [primes, setPrimes] = useState<PrimeChauffeur[]>([]);
  const [archives, setArchives] = useState<PrimeArchive[]>([]);
  const [stats, setStats] = useState<PrimeStats>({
    total_primes: 0,
    montant_total: '0 FCFA',
    montant_en_cours: '0 FCFA',
    montant_paye: '0 FCFA',
    nombre_en_cours: 0,
    nombre_paye: 0
  });
  const [archiveStats, setArchiveStats] = useState<any>(null);
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

  const loadArchives = async () => {
    try {
      const data = await primeService.getArchives();
      setArchives(data);
    } catch (error) {
      console.error('Erreur lors du chargement des archives:', error);
    }
  };

  const loadArchiveStats = async () => {
    try {
      const data = await primeService.getArchiveStats();
      setArchiveStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats archives:', error);
    }
  };

  const payerEnLot = async (sortieIds: number[]) => {
    try {
      const result = await primeService.payerEnLot(sortieIds);
      await loadPrimes();
      await loadStats();
      await loadArchives();
      await loadArchiveStats();
      toast({
        title: "Succès",
        description: `${result.nombre_primes} prime(s) payée(s) pour un total de ${result.montant_total_formatte}`
      });
    } catch (error) {
      console.error('Erreur lors du paiement en lot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de payer les primes sélectionnées",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPrimes();
    loadStats();
    loadArchives();
    loadArchiveStats();
  }, []);

  return {
    primes,
    archives,
    stats,
    archiveStats,
    loading,
    updatePrime,
    payerEnLot,
    refresh: () => {
      loadPrimes();
      loadStats();
      loadArchives();
      loadArchiveStats();
    }
  };
}
