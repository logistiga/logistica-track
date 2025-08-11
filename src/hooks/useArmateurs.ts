import { useState, useEffect } from "react";
import { armateurService, Armateur } from "@/services/armateurService";

export { type Armateur } from "@/services/armateurService";

export function useArmateurs() {
  const [armateurs, setArmateurs] = useState<Armateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArmateurs();
  }, []);

  const loadArmateurs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await armateurService.getArmateurs();
      setArmateurs(data);
    } catch (err) {
      setError('Erreur lors du chargement des armateurs');
      console.error('Erreur armateurs:', err);
      
      // Fallback vers les données mock en cas d'erreur
      const mockData = getArmateursMockData();
      setArmateurs(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getArmateurByCode = (code: string): Armateur | undefined => {
    return armateurs.find(a => a.code === code);
  };

  const getArmateurById = (id: number): Armateur | undefined => {
    return armateurs.find(a => a.id === id);
  };

  const getArmateurOptions = () => {
    return armateurs
      .filter(armateur => armateur.actif)
      .map(armateur => ({
        value: armateur.id.toString(),
        label: `${armateur.code} - ${armateur.nom}`
      }));
  };

  const getArmateurDisplay = (id: number): string => {
    const armateur = getArmateurById(id);
    return armateur ? `${armateur.code} - ${armateur.nom}` : id.toString();
  };

  return {
    armateurs,
    loading,
    error,
    getArmateurByCode,
    getArmateurById,
    getArmateurOptions,
    getArmateurDisplay,
    reload: loadArmateurs
  };
}

// Mock data - fallback en cas d'erreur API
function getArmateursMockData(): Armateur[] {
  return [
    { 
      id: 1, 
      code: "CMA", 
      nom: "CMA-CGM", 
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 2, 
      code: "MSK", 
      nom: "MAERSK", 
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 3, 
      code: "ONE", 
      nom: "Ocean Network Express", 
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];
}