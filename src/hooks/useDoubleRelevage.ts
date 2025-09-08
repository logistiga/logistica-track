import { useState, useEffect } from 'react';
import { doubleRelevageService, type DoubleRelevage } from '@/services/doubleRelevageService';
import { toast } from '@/hooks/use-toast';

export function useDoubleRelevage() {
  const [operations, setOperations] = useState<DoubleRelevage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDoubleRelevages = async () => {
    try {
      setLoading(true);
      const response = await doubleRelevageService.getDoubleRelevages();
      setOperations(response.data);
    } catch (error) {
      console.error('Error loading double relevages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les opérations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOperation = async (data: any) => {
    try {
      await doubleRelevageService.createDoubleRelevage({
        nom_client: data.nomClient,
        numero_conteneur: data.numeroConteneur,
        provenance: data.provenance,
        camion_ameneur_proprietaire: data.camionAmeneur.proprietaire,
        camion_ameneur_plaque: data.camionAmeneur.plaque,
        camion_ameneur_remorque: data.camionAmeneur.plaqueRemorque,
        camion_recuperateur_proprietaire: data.camionRecuperateur.proprietaire,
        camion_recuperateur_plaque: data.camionRecuperateur.plaque,
        camion_recuperateur_remorque: data.camionRecuperateur.plaqueRemorque,
        montant_operation: data.montantOperation,
        observations: data.observations
      });
      
      loadDoubleRelevages();
      toast({
        title: "Succès",
        description: "Opération de double relevage enregistrée"
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'opération",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleConfirmOperation = async (id: number) => {
    try {
      await doubleRelevageService.confirmerDoubleRelevage(id);
      loadDoubleRelevages();
      toast({
        title: "Opération confirmée",
        description: "L'opération de double relevage a été confirmée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de confirmer l'opération",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOperation = async (id: number) => {
    try {
      await doubleRelevageService.deleteDoubleRelevage(id);
      loadDoubleRelevages();
      toast({
        title: "Supprimé",
        description: "Opération supprimée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'opération",
        variant: "destructive"
      });
    }
  };

  const filteredOperations = operations.filter(item =>
    item.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.provenance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadDoubleRelevages();
  }, []);

  return {
    operations: filteredOperations,
    loading,
    searchTerm,
    setSearchTerm,
    handleAddOperation,
    handleConfirmOperation,
    handleDeleteOperation,
    reloadOperations: loadDoubleRelevages
  };
}