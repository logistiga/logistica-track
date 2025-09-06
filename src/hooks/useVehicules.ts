import { useState, useEffect } from 'react';
import { vehiculeService, type Vehicule, type CreateVehiculeData } from '@/services/vehiculeService';
import { mockVehiculeService } from '@/services/mockVehiculeService';
import { toast } from '@/hooks/use-toast';

// Utiliser temporairement le service mock car il y a un problème d'authentification avec l'API
const USE_MOCK = true;
const activeVehiculeService = USE_MOCK ? mockVehiculeService : vehiculeService;

export function useVehicules() {
  const [camions, setCamions] = useState<Vehicule[]>([]);
  const [remorques, setRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicules = async () => {
    try {
      setLoading(true);
      const vehicules = await activeVehiculeService.getVehicules();
      setCamions(vehicules.filter(v => v.type === 'camion'));
      setRemorques(vehicules.filter(v => v.type === 'remorque'));
    } catch (error) {
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
      const newVehicule = await activeVehiculeService.createVehicule(data);
      
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
      await activeVehiculeService.deleteVehicule(id);
      
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

  useEffect(() => {
    fetchVehicules();
  }, []);

  // Méthodes utilitaires pour compatibilité avec l'existant
  const getCamionOptions = () => {
    return camions.filter(c => c.actif).map(c => ({
      value: c.id.toString(),
      label: `${c.numero_parc} - ${c.immatriculation}`,
    }));
  };

  const getRemorqueOptions = () => {
    return remorques.filter(r => r.actif).map(r => ({
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
    deleteVehicule,
    getCamionOptions,
    getRemorqueOptions,
    getVehiculeDisplay,
  };
}