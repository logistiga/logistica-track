import { useState, useEffect, useCallback, useMemo } from 'react';
import { vehiculeService, type Vehicule, type CreateVehiculeData } from '@/services/vehiculeService';
import { toast } from '@/hooks/use-toast';

export function useVehicules() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vehiculeService.getVehicules();
      setVehicules(data);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les véhicules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicules();
  }, [fetchVehicules]);

  // Filtrage par type - memoized
  const camions = useMemo(() => vehicules.filter(v => v.type === 'camion'), [vehicules]);
  const remorques = useMemo(() => vehicules.filter(v => v.type === 'remorque'), [vehicules]);

  const createVehicule = useCallback(async (data: CreateVehiculeData): Promise<boolean> => {
    try {
      const newVehicule = await vehiculeService.createVehicule(data);
      setVehicules(prev => [...prev, newVehicule]);
      toast({
        title: "Succès",
        description: `${data.type === "camion" ? "Camion" : "Remorque"} ajouté(e) avec succès`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du véhicule",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const deleteVehicule = useCallback(async (id: number, type: 'camion' | 'remorque'): Promise<boolean> => {
    try {
      await vehiculeService.deleteVehicule(id);
      setVehicules(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Supprimé",
        description: `${type === "camion" ? "Camion" : "Remorque"} supprimé(e) avec succès`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const updateVehicule = useCallback(async (id: number, data: CreateVehiculeData): Promise<boolean> => {
    try {
      const updatedVehicule = await vehiculeService.updateVehicule(id, data);
      setVehicules(prev => prev.map(v => v.id === id ? updatedVehicule : v));
      toast({
        title: "Succès",
        description: `${data.type === "camion" ? "Camion" : "Remorque"} modifié(e) avec succès`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du véhicule",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Options pour les selects - memoized
  const getCamionOptions = useCallback(() => {
    return camions.map(c => ({
      value: c.id.toString(),
      label: c.libelle_complet || `${c.numero_parc} - ${c.immatriculation}`,
    }));
  }, [camions]);

  const getRemorqueOptions = useCallback(() => {
    return remorques.map(r => ({
      value: r.id.toString(),
      label: r.libelle_complet || `${r.numero_parc} - ${r.immatriculation}`,
    }));
  }, [remorques]);

  const getVehiculeDisplay = useCallback((id: number): string => {
    const vehicule = vehicules.find(v => v.id === id);
    return vehicule?.numero_parc ?? '';
  }, [vehicules]);

  return {
    vehicules,
    camions,
    remorques,
    loading,
    fetchVehicules,
    createVehicule,
    updateVehicule,
    deleteVehicule,
    getCamionOptions,
    getRemorqueOptions,
    getVehiculeDisplay,
  };
}