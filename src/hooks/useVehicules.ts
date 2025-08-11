import { useState, useEffect } from "react";

export interface Vehicule {
  id: string;
  numeroParc: string;
  immatriculation: string;
  statut: "disponible" | "en_mission" | "maintenance";
  type: "camion" | "remorque";
}

export function useVehicules() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVehicules();
  }, []);

  const loadVehicules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulation d'un appel API - remplacer par votre logique réelle
      const data = getVehiculesMockData();
      setVehicules(data);
    } catch (err) {
      setError('Erreur lors du chargement des véhicules');
      console.error('Erreur véhicules:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCamions = () => {
    return vehicules.filter(v => v.type === "camion");
  };

  const getRemorques = () => {
    return vehicules.filter(v => v.type === "remorque");
  };

  const getCamionsDisponibles = () => {
    return getCamions().filter(v => v.statut === "disponible");
  };

  const getRemorquesDisponibles = () => {
    return getRemorques().filter(v => v.statut === "disponible");
  };

  const getVehiculeById = (id: string): Vehicule | undefined => {
    return vehicules.find(v => v.id === id);
  };

  const getCamionOptions = () => {
    return getCamionsDisponibles().map(camion => ({
      value: camion.id,
      label: `${camion.numeroParc} - ${camion.immatriculation}`
    }));
  };

  const getRemorqueOptions = () => {
    return getRemorquesDisponibles().map(remorque => ({
      value: remorque.id,
      label: `${remorque.numeroParc} - ${remorque.immatriculation}`
    }));
  };

  const getVehiculeDisplay = (id: string): string => {
    const vehicule = getVehiculeById(id);
    return vehicule ? vehicule.numeroParc : id;
  };

  const updateVehiculeStatut = (id: string, statut: Vehicule['statut']) => {
    setVehicules(prev => 
      prev.map(v => v.id === id ? { ...v, statut } : v)
    );
  };

  return {
    vehicules,
    loading,
    error,
    getCamions,
    getRemorques,
    getCamionsDisponibles,
    getRemorquesDisponibles,
    getVehiculeById,
    getCamionOptions,
    getRemorqueOptions,
    getVehiculeDisplay,
    updateVehiculeStatut,
    reload: loadVehicules
  };
}

// Mock data - remplacer par une vraie source de données
function getVehiculesMockData(): Vehicule[] {
  try {
    const stored = localStorage.getItem('vehicules');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore les erreurs de parsing
  }

  // Données par défaut
  const defaultVehicules: Vehicule[] = [
    // Camions
    { 
      id: "1", 
      numeroParc: "TR 37", 
      immatriculation: "TR 37", 
      statut: "disponible", 
      type: "camion" 
    },
    { 
      id: "2", 
      numeroParc: "tr 07", 
      immatriculation: "tr 07", 
      statut: "en_mission", 
      type: "camion" 
    },
    { 
      id: "3", 
      numeroParc: "tr 08", 
      immatriculation: "tr 08", 
      statut: "disponible", 
      type: "camion" 
    },
    { 
      id: "4", 
      numeroParc: "TR 41", 
      immatriculation: "TR 41", 
      statut: "disponible", 
      type: "camion" 
    },
    // Remorques
    { 
      id: "5", 
      numeroParc: "R 01", 
      immatriculation: "R01", 
      statut: "disponible", 
      type: "remorque" 
    },
    { 
      id: "6", 
      numeroParc: "R 02", 
      immatriculation: "R02", 
      statut: "disponible", 
      type: "remorque" 
    },
    { 
      id: "7", 
      numeroParc: "R 03", 
      immatriculation: "R03", 
      statut: "en_mission", 
      type: "remorque" 
    },
  ];

  // Sauvegarder les données par défaut
  try {
    localStorage.setItem('vehicules', JSON.stringify(defaultVehicules));
  } catch {
    // Ignore les erreurs de stockage
  }

  return defaultVehicules;
}