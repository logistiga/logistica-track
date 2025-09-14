import { useState, useEffect } from 'react';
import { detentionService, DetentionStats, DetentionFilters } from '@/services/detentionService';
import { DetentionContainer } from '@/types/detention';
import { useToast } from '@/hooks/use-toast';
import { MOCK_DETENTION_DATA, MOCK_DETENTION_STATS } from '@/services/detention/mockData';

export interface UseDetentionReturn {
  detentions: DetentionContainer[];
  stats: DetentionStats | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  // Actions
  fetchDetentions: (filters?: DetentionFilters) => Promise<void>;
  fetchStats: (filters?: Pick<DetentionFilters, 'dateDebut' | 'dateFin'>) => Promise<void>;
  resolveDetention: (id: string, observations?: string) => Promise<void>;
  contestDetention: (id: string, motif: string) => Promise<void>;
  exportDetentions: (filters?: DetentionFilters) => Promise<void>;
  // State setters
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
}

export function useDetention(): UseDetentionReturn {
  const [detentions, setDetentions] = useState<DetentionContainer[]>([]);
  const [stats, setStats] = useState<DetentionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();

  const fetchDetentions = async (filters: DetentionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching detentions with filters:', filters);
      const response = await detentionService.getDetentions(filters);
      console.log('📦 Detentions response:', response);
      
      if (response.success && response.data) {
        setDetentions(response.data);
        setTotalPages(response.meta?.last_page || 1);
        setCurrentPage(response.meta?.current_page || 1);
        console.log('✅ Detentions loaded successfully:', response.data.length, 'items');
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des détentions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur chargement détentions:', err);
      
      console.log('⚠️ Fallback to mock data');
      setDetentions(MOCK_DETENTION_DATA);
      
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les détentions. Données de démonstration affichées.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (filters: Pick<DetentionFilters, 'dateDebut' | 'dateFin'> = {}) => {
    try {
      const statsData = await detentionService.getDetentionStats(filters);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
      setStats(MOCK_DETENTION_STATS);
    }
  };

  const resolveDetention = async (id: string, observations?: string) => {
    try {
      setLoading(true);
      const response = await detentionService.resolveDetention(id, observations);
      
      if (response.success) {
        toast({
          title: 'Détention résolue',
          description: 'La détention a été marquée comme résolue avec succès.',
        });
        await Promise.all([fetchDetentions(), fetchStats()]);
      } else {
        throw new Error(response.message || 'Erreur lors de la résolution');
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: `Impossible de résoudre la détention: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const contestDetention = async (id: string, motif: string) => {
    try {
      setLoading(true);
      const response = await detentionService.contestDetention(id, motif);
      
      if (response.success) {
        toast({
          title: 'Détention contestée',
          description: 'La détention a été marquée comme contestée.',
        });
        await Promise.all([fetchDetentions(), fetchStats()]);
      } else {
        throw new Error(response.message || 'Erreur lors de la contestation');
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: `Impossible de contester la détention: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportDetentions = async (filters: DetentionFilters = {}) => {
    try {
      setLoading(true);
      const response = await detentionService.exportDetentions(filters);
      
      if (response.success) {
        toast({
          title: 'Export généré',
          description: `Export de ${response.data.total_records} détentions généré avec succès.`,
        });
      } else {
        throw new Error(response.message || 'Erreur lors de l\'export');
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: `Impossible de générer l'export: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchDetentions(), fetchStats()]);
  }, []);

  return {
    detentions,
    stats,
    loading,
    error,
    totalPages,
    currentPage,
    fetchDetentions,
    fetchStats,
    resolveDetention,
    contestDetention,
    exportDetentions,
    setCurrentPage,
    setLoading,
  };
}