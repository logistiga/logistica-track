import { useState, useEffect } from "react";
import { vehiculeService, Vehicule } from "@/services/vehiculeService";

export { type Vehicule } from "@/services/vehiculeService";

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
      
      const data = await vehiculeService.getVehicules();
      setVehicules(data);
    } catch (err) {
      setError('Erreur lors du chargement des véhicules');
      console.error('Erreur véhicules:', err);
      
      // Fallback vers les données mock en cas d'erreur
      const mockData = getVehiculesMockData();
      setVehicules(mockData);
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
    return getCamions().filter(v => v.statut === "disponible" && v.actif);
  };

  const getRemorquesDisponibles = () => {
    return getRemorques().filter(v => v.statut === "disponible" && v.actif);
  };

  const getVehiculeById = (id: number): Vehicule | undefined => {
    return vehicules.find(v => v.id === id);
  };

  const getCamionOptions = () => {
    return getCamionsDisponibles().map(camion => ({
      value: camion.id.toString(),
      label: `${camion.numero_parc} - ${camion.immatriculation}`
    }));
  };

  const getRemorqueOptions = () => {
    return getRemorquesDisponibles().map(remorque => ({
      value: remorque.id.toString(),
      label: `${remorque.numero_parc} - ${remorque.immatriculation}`
    }));
  };

  const getVehiculeDisplay = (id: number): string => {
    const vehicule = getVehiculeById(id);
    return vehicule ? vehicule.numero_parc : id.toString();
  };

  const updateVehiculeStatut = async (id: number, statut: Vehicule['statut']) => {
    try {
      const updated = await vehiculeService.updateStatut(id, statut);
      setVehicules(prev => 
        prev.map(v => v.id === id ? updated : v)
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      // Mise à jour locale en cas d'erreur
      setVehicules(prev => 
        prev.map(v => v.id === id ? { ...v, statut } : v)
      );
    }
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

// Mock data - fallback en cas d'erreur API
function getVehiculesMockData(): Vehicule[] {
  return [
    { 
      id: 1, 
      numero_parc: "TR 37", 
      immatriculation: "TR 37", 
      statut: "disponible", 
      type: "camion",
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 2, 
      numero_parc: "tr 07", 
      immatriculation: "tr 07", 
      statut: "en_mission", 
      type: "camion",
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 3, 
      numero_parc: "R 01", 
      immatriculation: "R01", 
      statut: "disponible", 
      type: "remorque",
      actif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];
}