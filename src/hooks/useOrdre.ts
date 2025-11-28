import { useState, useEffect } from 'react';
import { OrdreOperation, OrdreSortieStandard, UpdateOrdreOperationData, UpdateOrdreSortieData } from "@/types/ordre";
import { operationService } from '@/services/operationService';
import { sortieConteneurService } from '@/services/sortieConteneurService';
import { useToast } from "@/hooks/use-toast";

export function useOrdre() {
  const { toast } = useToast();
  const [operations, setOperations] = useState<OrdreOperation[]>([]);
  const [sorties, setSorties] = useState<OrdreSortieStandard[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les opérations confirmées
  const loadOperations = async () => {
    setLoading(true);
    try {
      const data = await operationService.getOperations();
      // Filtrer uniquement les opérations confirmées en attente de validation
      const confirmedOps = Array.isArray(data) 
        ? data.filter((op: any) => op.statut === 'confirmee')
        : [];
      
      // Mapper au format OrdreOperation
      const mappedOps: OrdreOperation[] = confirmedOps.map((op: any) => ({
        id: op.id?.toString() || '',
        typeOperation: op.typeOperation || op.type_operation || '',
        dateExecution: op.dateExecution || op.date_execution || '',
        camion: op.camion || '',
        remorque: op.remorque || '',
        client: op.client || '',
        instructions: op.instructions || '',
        montant: parseFloat(op.montant || 0),
        numeroOrdre: op.numeroOrdre || op.numero_ordre || '',
        statut: 'en-attente'
      }));
      
      setOperations(mappedOps);
    } catch (error) {
      console.error('Erreur lors du chargement des opérations:', error);
      setOperations([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les sorties en cours
  const loadSorties = async () => {
    setLoading(true);
    try {
      const data = await sortieConteneurService.getSorties();
      console.log('📥 Raw API data received:', data);
      
      // Filtrer uniquement les sorties retournées au port (en attente de validation)
      // Exclure les sorties déjà archivées
      const sortiesEnCours = Array.isArray(data)
        ? data.filter((s: any) => s.statut === 'retourne_port')
        : [];
      
      console.log('🔍 Filtered sorties (retourne_port):', sortiesEnCours);
      
      // Mapper au format OrdreSortieStandard
      const mappedSorties: OrdreSortieStandard[] = sortiesEnCours.map((s: any) => {
        console.log('🗺️ Mapping sortie:', {
          id: s.id,
          numero_conteneur: s.numero_conteneur,
          pv_sortie: s.pv_sortie,
          pvSortie: s.pvSortie,
          pv_rentree_port: s.pv_rentree_port,
          pvRentreePort: s.pvRentreePort,
          numero_ordre: s.numero_ordre,
          numeroOrdre: s.numeroOrdre
        });
        
        return {
          id: s.id?.toString() || '',
          numeroConteneur: s.numero_conteneur || s.numeroConteneur || '',
          typeConteneur: s.armateur?.type_conteneur || s.type_conteneur || '',
          codeArmateur: s.code_armateur || s.armateur?.code || '',
          nomClient: s.nom_client || s.client?.nom || '',
          destination: s.destination || '',
          dateSortie: s.date_sortie || s.dateSortie || '',
          pvSortie: s.pv_sortie || s.pvSortie || '',
          pvRentreePort: s.pv_rentree_port || s.pvRentreePort || '',
          numeroOrdre: s.numero_ordre || s.numeroOrdre || '',
          statut: 'en-attente'
        };
      });
      
      console.log('✅ Final mapped sorties:', mappedSorties);
      setSorties(mappedSorties);
    } catch (error) {
      console.error('Erreur lors du chargement des sorties:', error);
      setSorties([]);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une opération
  const updateOperation = async (data: UpdateOrdreOperationData) => {
    try {
      await operationService.updateOperation(data.id, { 
        numeroOrdre: data.numeroOrdre 
      } as any);
      
      setOperations(prev => prev.map(op =>
        op.id === data.id ? { ...op, numeroOrdre: data.numeroOrdre } : op
      ));
      
      toast({
        title: "Numéro d'ordre ajouté",
        description: "Le numéro d'ordre a été sauvegardé."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'opération.",
        variant: "destructive"
      });
    }
  };

  // Mettre à jour une sortie
  const updateSortie = async (data: UpdateOrdreSortieData) => {
    try {
      console.log('📤 Updating sortie:', data);
      
      await sortieConteneurService.updateSortie(parseInt(data.id), {
        pv_sortie: data.pvSortie,
        pv_rentree_port: data.pvRentreePort,
        numero_ordre: data.numeroOrdre
      } as any);
      
      // IMPORTANT: Recharger toutes les sorties depuis le backend pour avoir les données fraîches
      console.log('🔄 Reloading sorties from backend...');
      await loadSorties();
      
      toast({
        title: "Informations mises à jour",
        description: "Les données ont été sauvegardées."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la sortie.",
        variant: "destructive"
      });
    }
  };

  // Supprimer une opération
  const deleteOperation = async (operation: OrdreOperation) => {
    try {
      await operationService.deleteOperation(operation.id);
      setOperations(prev => prev.filter(op => op.id !== operation.id));
      toast({
        title: "Opération supprimée",
        description: "L'opération a été supprimée."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'opération.",
        variant: "destructive"
      });
    }
  };

  // Supprimer une sortie
  const deleteSortie = async (sortie: OrdreSortieStandard) => {
    try {
      await sortieConteneurService.deleteSortie(parseInt(sortie.id));
      setSorties(prev => prev.filter(s => s.id !== sortie.id));
      toast({
        title: "Sortie supprimée",
        description: "La sortie a été supprimée."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la sortie.",
        variant: "destructive"
      });
    }
  };

  // Confirmer une opération (l'envoyer aux archives)
  const confirmOperation = async (operation: OrdreOperation) => {
    try {
      // Mettre à jour le statut pour marquer comme validé
      await operationService.updateStatut(operation.id, 'valide' as any);
      setOperations(prev => prev.filter(op => op.id !== operation.id));
      toast({
        title: "Opération validée",
        description: "L'opération a été envoyée vers les Archives Opérations."
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'opération.",
        variant: "destructive"
      });
    }
  };

  // Confirmer une sortie (l'envoyer aux archives)
  const confirmSortie = async (sortie: OrdreSortieStandard) => {
    try {
      // Vérifier que les champs obligatoires sont remplis
      if (!sortie.pvSortie || !sortie.pvRentreePort || !sortie.numeroOrdre) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir PV Sortie, PV Rentrée et N° Ordre avant de valider.",
          variant: "destructive"
        });
        return;
      }

      // Archiver la sortie (créer prime_archive et changer statut)
      await sortieConteneurService.archiverSortie(parseInt(sortie.id));
      
      // Recharger les sorties pour mettre à jour la liste
      await loadSorties();
      
      toast({
        title: "Sortie validée",
        description: "La sortie a été envoyée vers les Archives Sortie."
      });
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider la sortie.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadOperations();
    loadSorties();
  }, []);

  return {
    operations,
    sorties,
    loading,
    updateOperation,
    updateSortie,
    deleteOperation,
    deleteSortie,
    confirmOperation,
    confirmSortie,
    loadOperations,
    loadSorties
  };
}
