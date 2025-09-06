import { useState, useEffect } from 'react';
import { Operation, CreateOperationData } from "@/types/operations";
import { operationService } from '@/services/operationService';
import { vehiculeService, Vehicule } from '@/services/vehiculeService';
import { useToast } from "@/hooks/use-toast";

// Interface pour adapter les types de véhicules
interface VehicleOption {
  id: string;
  numero: string;
  marque?: string;
  modele?: string;
  type?: string;
}

export function useOperations() {
  const { toast } = useToast();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [rawCamions, setRawCamions] = useState<Vehicule[]>([]);
  const [rawRemorques, setRawRemorques] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(false);

  // Adapter les véhicules au format attendu
  const camions = rawCamions.map(v => ({
    id: v.id.toString(),
    numero: v.numero_parc,
    marque: v.immatriculation.split(' ')[0] || 'Mercedes',
    modele: v.immatriculation.split(' ').slice(1).join(' ') || 'Actros'
  }));

  const remorques = rawRemorques.map(v => ({
    id: v.id.toString(),
    numero: v.numero_parc,
    type: v.type_label || v.type || 'Porte-conteneur'
  }));

  // Clients statiques pour le moment
  const clients = ["Client ABC", "Client XYZ", "Client DEF", "Transport Martin", "Logistics Pro"];

  // Charger les véhicules
  const loadVehicules = async () => {
    try {
      const [camionsData, remorquesData] = await Promise.all([
        vehiculeService.getVehiculesActifs('camion'),
        vehiculeService.getVehiculesActifs('remorque')
      ]);
      setRawCamions(camionsData);
      setRawRemorques(remorquesData);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    }
  };

  // Charger les opérations
  const loadOperations = async () => {
    setLoading(true);
    try {
      const data = await operationService.getOperations();
      setOperations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des opérations:', error);
      showToast('Erreur', 'Impossible de charger les opérations');
    } finally {
      setLoading(false);
    }
  };

  // Créer une opération (version simplifiée pour correspondre aux types existants)
  const createOperation = (data: CreateOperationData): Operation => {
    return {
      id: Date.now().toString(),
      ...data,
      statut: "en-attente",
      dateCreation: new Date().toISOString().split('T')[0]
    };
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  useEffect(() => {
    loadVehicules();
    // loadOperations(); // Commenté pour l'instant car pas encore d'API backend
  }, []);

  return {
    operations,
    camions,
    remorques,
    clients,
    loading,
    createOperation,
    loadOperations,
    showToast
  };
}