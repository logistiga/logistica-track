import { useState, useEffect } from 'react';
import { armateurService, type Armateur, type CreateArmateurData } from '@/services/armateurService';
import { mockArmateurService } from '@/services/mockArmateurService';
import { toast } from '@/hooks/use-toast';

// Utiliser le service mock temporairement pour éviter les erreurs CORS
const USE_MOCK = true;
const activeArmateurService = USE_MOCK ? mockArmateurService : armateurService;

export function useArmateurs() {
  const [armateurs, setArmateurs] = useState<Armateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArmateurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activeArmateurService.getArmateurs();
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
  };

  const createArmateur = async (data: CreateArmateurData): Promise<boolean> => {
    try {
      const newArmateur = await activeArmateurService.createArmateur(data);
      setArmateurs(prev => [...prev, newArmateur]);
      toast({
        title: "Succès",
        description: "Armateur créé avec succès",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateArmateur = async (id: number, data: Partial<CreateArmateurData>): Promise<boolean> => {
    try {
      const updatedArmateur = await activeArmateurService.updateArmateur(id, data);
      setArmateurs(prev => prev.map(a => a.id === id ? updatedArmateur : a));
      toast({
        title: "Succès",
        description: "Armateur modifié avec succès",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteArmateur = async (id: number): Promise<boolean> => {
    try {
      await activeArmateurService.deleteArmateur(id);
      setArmateurs(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Succès",
        description: "Armateur supprimé avec succès",
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Méthodes utilitaires pour compatibilité avec l'existant
  const getArmateurByCode = (code: string): Armateur | undefined => {
    return armateurs.find(a => a.code === code);
  };

  const getArmateurById = (id: number): Armateur | undefined => {
    return armateurs.find(a => a.id === id);
  };

  const getArmateurOptions = () => {
    return armateurs.map(a => ({
      value: a.code,
      label: `${a.code} - ${a.nom}`,
    }));
  };

  const getArmateurDisplay = (id: number): string => {
    const armateur = getArmateurById(id);
    return armateur ? `${armateur.code} - ${armateur.nom}` : '';
  };

  useEffect(() => {
    fetchArmateurs();
  }, []);

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