import { useState, useEffect } from 'react';
import { vehiculeService, type Vehicule, type CreateVehiculeData } from '@/services/vehiculeService';
import { toast } from '@/hooks/use-toast';

export function useVehicules() {
  const [camions, setCamions] = useState<Vehicule[]>([]);
  const [remorques, setRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicules = async () => {
    try {
      setLoading(true);
      const vehicules = await vehiculeService.getVehicules();
      console.log('Véhicules reçus:', vehicules);
      
      const camionsFiltered = vehicules.filter(v => v.type === 'camion');
      const remorquesFiltered = vehicules.filter(v => v.type === 'remorque');
      
      console.log('Camions filtrés:', camionsFiltered);
      console.log('Remorques filtrées:', remorquesFiltered);
      
      setCamions(camionsFiltered);
      setRemorques(remorquesFiltered);
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
  };

  const createVehicule = async (data: CreateVehiculeData): Promise<boolean> => {
    try {
      const newVehicule = await vehiculeService.createVehicule(data);
      
      if (data.type === "camion") {
        setCamions(prev => [...prev, newVehicule]);
      } else {
        setRemorques(prev => [...prev, newVehicule]);
      }

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
  };

  const deleteVehicule = async (id: number, type: 'camion' | 'remorque'): Promise<boolean> => {
    try {
      await vehiculeService.deleteVehicule(id);
      
      if (type === "camion") {
        setCamions(prev => prev.filter(c => c.id !== id));
      } else {
        setRemorques(prev => prev.filter(r => r.id !== id));
      }
      
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
  };

  const updateVehicule = async (id: number, data: CreateVehiculeData): Promise<boolean> => {
    try {
      const updatedVehicule = await vehiculeService.updateVehicule(id, data);
      
      if (data.type === "camion") {
        setCamions(prev => prev.map(c => c.id === id ? updatedVehicule : c));
        // Remove from remorques if type changed
        setRemorques(prev => prev.filter(r => r.id !== id));
      } else {
        setRemorques(prev => prev.map(r => r.id === id ? updatedVehicule : r));
        // Remove from camions if type changed
        setCamions(prev => prev.filter(c => c.id !== id));
      }

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
  };

  useEffect(() => {
    fetchVehicules();
  }, []);

  // Méthodes utilitaires pour compatibilité avec l'existant
  const getCamionOptions = () => {
    return camions
      .filter((c) => c.actif && c.statut === 'disponible')
      .map((c) => ({
        value: c.id.toString(),
        label: `${c.numero_parc} - ${c.immatriculation}`,
      }));
  };

  const getRemorqueOptions = () => {
    return remorques
      .filter((r) => r.actif && r.statut === 'disponible')
      .map((r) => ({
        value: r.id.toString(),
        label: `${r.numero_parc} - ${r.immatriculation}`,
      }));
  };

  const getVehiculeDisplay = (id: number): string => {
    const allVehicules = [...camions, ...remorques];
    const vehicule = allVehicules.find(v => v.id === id);
    return vehicule ? `${vehicule.numero_parc} - ${vehicule.immatriculation}` : '';
  };

  return {
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