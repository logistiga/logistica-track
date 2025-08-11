import { useState, useEffect } from "react";

export interface Armateur {
  id: string;
  code: string;
  nom: string;
  typeConteneur: string;
  joursGratuits: number;
  prixParJour: number;
}

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
      
      // Simulation d'un appel API - remplacer par votre logique réelle
      const data = getArmateursMockData();
      setArmateurs(data);
    } catch (err) {
      setError('Erreur lors du chargement des armateurs');
      console.error('Erreur armateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getArmateurByCode = (code: string): Armateur | undefined => {
    return armateurs.find(a => a.code === code);
  };

  const getArmateurOptions = () => {
    return armateurs.map(armateur => ({
      value: armateur.code,
      label: `${armateur.code} - ${armateur.nom} (${armateur.typeConteneur})`
    }));
  };

  const getArmateurDisplay = (code: string): string => {
    const armateur = getArmateurByCode(code);
    return armateur ? `${armateur.code} - ${armateur.nom}` : code;
  };

  return {
    armateurs,
    loading,
    error,
    getArmateurByCode,
    getArmateurOptions,
    getArmateurDisplay,
    reload: loadArmateurs
  };
}

// Mock data - remplacer par une vraie source de données
function getArmateursMockData(): Armateur[] {
  try {
    const stored = localStorage.getItem('armateurs');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore les erreurs de parsing
  }

  // Données par défaut
  const defaultArmateurs: Armateur[] = [
    { 
      id: "1", 
      code: "CMA20", 
      nom: "CMA-CGM", 
      typeConteneur: "20' sec", 
      joursGratuits: 2, 
      prixParJour: 10000 
    },
    { 
      id: "2", 
      code: "CMA40", 
      nom: "CMA-CGM", 
      typeConteneur: "40' sec", 
      joursGratuits: 2, 
      prixParJour: 20000 
    },
    { 
      id: "3", 
      code: "CMA20FRIGO", 
      nom: "CMA-CGM", 
      typeConteneur: "20' frigo", 
      joursGratuits: 2, 
      prixParJour: 100000 
    },
    { 
      id: "4", 
      code: "MSK20", 
      nom: "MAERSK", 
      typeConteneur: "20' sec", 
      joursGratuits: 5, 
      prixParJour: 11800 
    },
  ];

  // Sauvegarder les données par défaut
  try {
    localStorage.setItem('armateurs', JSON.stringify(defaultArmateurs));
  } catch {
    // Ignore les erreurs de stockage
  }

  return defaultArmateurs;
}