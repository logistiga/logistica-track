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
      // S'assurer que data est toujours un tableau
      setOperations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des opérations:', error);
      showToast('Erreur', 'Impossible de charger les opérations');
      setOperations([]); // Réinitialiser à un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Créer une opération
  const createOperation = async (data: CreateOperationData) => {
    setLoading(true);
    try {
      const newOperation = await operationService.createOperation(data);
      setOperations(prev => [newOperation, ...prev]);
      showToast('Succès', 'Opération créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'opération:', error);
      showToast('Erreur', 'Impossible de créer l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une opération
  const updateOperation = async (id: string, data: Partial<CreateOperationData>) => {
    setLoading(true);
    try {
      const updated = await operationService.updateOperation(id, data);
      setOperations(prev => prev.map(op => op.id === id ? updated : op));
      showToast('Succès', 'Opération mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'opération:', error);
      showToast('Erreur', 'Impossible de mettre à jour l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une opération
  const deleteOperation = async (id: string) => {
    setLoading(true);
    try {
      await operationService.deleteOperation(id);
      setOperations(prev => prev.filter(op => op.id !== id));
      showToast('Succès', 'Opération supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'opération:', error);
      showToast('Erreur', 'Impossible de supprimer l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Confirmer une opération
  const confirmOperation = async (id: string) => {
    setLoading(true);
    try {
      const updated = await operationService.updateStatut(id, 'confirmee');
      setOperations(prev => prev.map(op => op.id === id ? updated : op));
      showToast('Succès', 'Opération confirmée avec succès');
    } catch (error) {
      console.error('Erreur lors de la confirmation de l\'opération:', error);
      showToast('Erreur', 'Impossible de confirmer l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Démarrer une opération
  const startOperation = async (id: string) => {
    setLoading(true);
    try {
      const updated = await operationService.updateStatut(id, 'en-cours');
      setOperations(prev => prev.map(op => op.id === id ? updated : op));
      showToast('Succès', 'Opération démarrée');
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur', 'Impossible de démarrer l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Terminer une opération
  const completeOperation = async (id: string) => {
    setLoading(true);
    try {
      const updated = await operationService.updateStatut(id, 'terminee');
      setOperations(prev => prev.map(op => op.id === id ? updated : op));
      showToast('Succès', 'Opération terminée');
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur', 'Impossible de terminer l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  useEffect(() => {
    loadVehicules();
    loadOperations();
  }, []);

  return {
    operations,
    camions,
    remorques,
    clients,
    loading,
    createOperation,
    updateOperation,
    deleteOperation,
    confirmOperation,
    startOperation,
    completeOperation,
    loadOperations,
    showToast
  };
}