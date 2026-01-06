import { useState, useEffect, useCallback, useMemo } from 'react';
import { armateurService, type Armateur, type CreateArmateurData } from '@/services/armateurService';
import { toast } from '@/hooks/use-toast';
import { getArmateurSelectOptions, getArmateurLabel } from '@/utils/armateurUtils';

export function useArmateurs() {
  const [armateurs, setArmateurs] = useState<Armateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArmateurs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await armateurService.getArmateurs();
      setArmateurs(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des armateurs';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArmateurs();
  }, [fetchArmateurs]);

  const createArmateur = useCallback(async (data: CreateArmateurData): Promise<boolean> => {
    try {
      const newArmateur = await armateurService.createArmateur(data);
      setArmateurs(prev => [...prev, newArmateur]);
      toast({ title: "Succès", description: "Armateur créé avec succès" });
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : 'Erreur lors de la création',
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const updateArmateur = useCallback(async (id: number, data: Partial<CreateArmateurData>): Promise<boolean> => {
    try {
      const updatedArmateur = await armateurService.updateArmateur(id, data);
      setArmateurs(prev => prev.map(a => a.id === id ? updatedArmateur : a));
      toast({ title: "Succès", description: "Armateur modifié avec succès" });
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : 'Erreur lors de la modification',
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const deleteArmateur = useCallback(async (id: number): Promise<boolean> => {
    try {
      await armateurService.deleteArmateur(id);
      setArmateurs(prev => prev.filter(a => a.id !== id));
      toast({ title: "Succès", description: "Armateur supprimé avec succès" });
      return true;
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : 'Erreur lors de la suppression',
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Méthodes utilitaires - memoized
  const getArmateurByCode = useCallback((code: string): Armateur | undefined => {
    return armateurs.find(a => a.code === code);
  }, [armateurs]);

  const getArmateurById = useCallback((id: number): Armateur | undefined => {
    return armateurs.find(a => a.id === id);
  }, [armateurs]);

  const getArmateurOptions = useCallback(() => {
    return getArmateurSelectOptions(armateurs);
  }, [armateurs]);

  const getArmateurDisplay = useCallback((id: number): string => {
    const armateur = armateurs.find(a => a.id === id);
    return armateur ? getArmateurLabel(armateur) : '';
  }, [armateurs]);

  return {
    armateurs,
    loading,
    error,
    fetchArmateurs,
    createArmateur,
    updateArmateur,
    deleteArmateur,
    getArmateurByCode,
    getArmateurById,
    getArmateurOptions,
    getArmateurDisplay,
  };
}