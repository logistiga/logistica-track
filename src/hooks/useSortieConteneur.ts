import { useState, useEffect, useCallback } from "react";
import { SortieConteneur, SortieFormData, ReturnData } from "@/types/sortie-conteneur";
import { sortieConteneurService, CreateSortieConteneurData } from "@/services/sortieConteneurService";
import { SortieConteneur as APISortieConteneur } from "@/services/sortieConteneurService";
import { useToast } from "@/hooks/use-toast";
import { validateFormData, getEmptyFormData } from "@/utils/sortieUtils";

// Fonction pour convertir l'API response vers le type local
const convertApiToLocal = (apiSortie: APISortieConteneur): SortieConteneur => {
  console.log('🔄 Converting API sortie:', { 
    id: apiSortie.id, 
    statut: apiSortie.statut, 
    date_retour: apiSortie.date_retour 
  });
  
  // Déterminer le statut basé sur la date de retour ET le statut explicite
  let mappedStatus: "en_cours" | "a_la_base" | "livre_client" | "retourne_port";
  
  // Si le statut est explicitement 'retourne_port' OU qu'il y a une date de retour
  if (apiSortie.statut === 'retourne_port' || apiSortie.date_retour) {
    mappedStatus = "retourne_port";
    console.log('📅 Setting status to retourne_port due to:', {
      explicitStatus: apiSortie.statut === 'retourne_port',
      hasReturnDate: !!apiSortie.date_retour
    });
  } else {
    // Sinon, mapper directement le statut de l'API
    mappedStatus = apiSortie.statut as "en_cours" | "a_la_base" | "livre_client" | "retourne_port";
  }
  
  console.log('📈 Final status mapping:', { 
    original: apiSortie.statut, 
    mapped: mappedStatus,
    hasReturnDate: !!apiSortie.date_retour
  });
  
  return {
    id: apiSortie.id.toString(),
    numeroConteneur: apiSortie.numero_conteneur,
    numeroBL: apiSortie.numero_bl,
    codeArmateur: apiSortie.armateur?.code || apiSortie.armateur_id.toString(),
    camion: apiSortie.camion?.libelle_complet || apiSortie.vehicule_camion?.numero_parc || apiSortie.camion_id?.toString() || "",
    remorque: apiSortie.remorque?.libelle_complet || apiSortie.vehicule_remorque?.numero_parc || apiSortie.remorque_id?.toString() || "",
    primeChauffeur: apiSortie.prime_chauffeur || 0,
    nomClient: apiSortie.nom_client,
    destination: apiSortie.destination as "base" | "client",
    adresseClient: apiSortie.adresse_client,
    typeDestination: apiSortie.type_destination as "bad" | "detention",
    joursBAD: apiSortie.jours_bad,
    dateFinFranchise: apiSortie.date_fin_franchise,
    nomTransitaire: apiSortie.nom_transitaire,
    dateSortie: apiSortie.date_sortie,
    dateRetour: apiSortie.date_retour,
    statut: mappedStatus
  };
};

export function useSortieConteneur() {
  const { toast } = useToast();
  const [sorties, setSorties] = useState<SortieConteneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState<SortieConteneur | null>(null);
  const [editingSortie, setEditingSortie] = useState<SortieConteneur | null>(null);
  const [formData, setFormData] = useState<SortieFormData>(getEmptyFormData());
  const [returnData, setReturnData] = useState<ReturnData & { responsabilite?: string }>({
    dateRetour: "",
    camionRetour: "",
    remorqueRetour: "",
    responsabilite: ""
  });

  // Chargement initial des données
  useEffect(() => {
    loadSorties();
  }, []);

  const loadSorties = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading sorties...');
      const data = await sortieConteneurService.getSorties();
      console.log('📥 Raw API data received:', data.map(s => ({ id: s.id, statut: s.statut })));
      
      const convertedData = data.map(convertApiToLocal);
      console.log('🔄 Converted data:', convertedData.map(s => ({ id: s.id, statut: s.statut })));
      
      setSorties(convertedData);
      console.log('✅ Sorties loaded successfully');
    } catch (error) {
      console.error('❌ Error loading sorties:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des sorties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      toast({
        title: "Erreurs de validation",
        description: errors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      // Ne pas envoyer date_fin_franchise si elle est dans le passé
      // Laisser le backend calculer automatiquement
      const today = new Date();
      const dateFinFranchise = formData.dateFinFranchise && new Date(formData.dateFinFranchise) > today 
        ? formData.dateFinFranchise 
        : undefined;

      const createData: CreateSortieConteneurData = {
        numero_conteneur: formData.numeroConteneur,
        numero_bl: formData.numeroBL,
        code_armateur: formData.codeArmateur,
        camion_id: formData.camion ? parseInt(formData.camion) : undefined,
        remorque_id: formData.remorque ? parseInt(formData.remorque) : undefined,
        nom_client: formData.nomClient,
        adresse_client: formData.adresseClient,
        destination: formData.destination as 'base' | 'client',
        type_destination: formData.typeDestination as 'bad' | 'detention',
        date_sortie: formData.dateSortie,
        prime_chauffeur: formData.primeChauffeur ? parseInt(formData.primeChauffeur) : undefined,
        jours_bad: formData.joursBAD ? parseInt(formData.joursBAD) : undefined,
        date_fin_franchise: dateFinFranchise,
        nom_transitaire: formData.nomTransitaire
      };

      if (editingSortie) {
        // Mode modification
        const updated = await sortieConteneurService.updateSortie(parseInt(editingSortie.id), createData);
        const convertedUpdated = convertApiToLocal(updated);
        setSorties(prev => prev.map(s => s.id === editingSortie.id ? convertedUpdated : s));
        toast({
          title: "Sortie modifiée",
          description: "Les modifications ont été enregistrées."
        });
        setEditingSortie(null);
      } else {
        // Mode création
        const nouvelleSortie = await sortieConteneurService.createSortie(createData);
        const convertedNew = convertApiToLocal(nouvelleSortie);
        setSorties(prev => [...prev, convertedNew]);
        toast({
          title: "Sortie ajoutée",
          description: "La nouvelle sortie de conteneur a été enregistrée."
        });
      }

      // Reset form
      setFormData(getEmptyFormData());
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      let errorMessage = 'Erreur lors de l\'enregistrement';
      
      if (error.response?.data?.errors) {
        // Erreurs de validation Laravel
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [formData, editingSortie, toast]);

  const handleEdit = useCallback((sortie: SortieConteneur) => {
    setEditingSortie(sortie);
    setFormData({
      numeroConteneur: sortie.numeroConteneur,
      numeroBL: sortie.numeroBL,
      codeArmateur: sortie.codeArmateur,
      camion: sortie.camion,
      remorque: sortie.remorque,
      primeChauffeur: sortie.primeChauffeur?.toString() || "",
      nomClient: sortie.nomClient,
      destination: sortie.destination,
      adresseClient: sortie.adresseClient || "",
      typeDestination: sortie.typeDestination,
      joursBAD: sortie.joursBAD?.toString() || "",
      dateFinFranchise: sortie.dateFinFranchise || "",
      nomTransitaire: sortie.nomTransitaire || "",
      dateSortie: sortie.dateSortie
    });
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (sortie: SortieConteneur) => {
    try {
      await sortieConteneurService.deleteSortie(parseInt(sortie.id));
      setSorties(prev => prev.filter(s => s.id !== sortie.id));
      toast({
        title: "Sortie supprimée",
        description: "La sortie de conteneur a été supprimée."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleReturnClick = useCallback((sortie: SortieConteneur) => {
    setSelectedSortie(sortie);
    setIsReturnDialogOpen(true);
  }, []);

  const handleConfirmReturn = useCallback(async () => {
    if (!selectedSortie || !returnData.dateRetour) return;

    console.log('🔄 Starting return confirmation for sortie:', selectedSortie.id);
    console.log('📊 Current return data:', returnData);
    console.log('📈 Sortie status before return:', selectedSortie.statut);

    try {
      const retourData = {
        date_retour: returnData.dateRetour,
        heure_retour: "12:00",
        camion_retour_id: returnData.camionRetour ? parseInt(returnData.camionRetour) : undefined,
        remorque_retour_id: returnData.remorqueRetour ? parseInt(returnData.remorqueRetour) : undefined
      };

      console.log('📤 Sending return data to service:', retourData);
      const updated = await sortieConteneurService.confirmerRetour(parseInt(selectedSortie.id), retourData);
      console.log('📥 Received updated sortie from service:', updated);
      console.log('📈 Service returned status:', updated.statut);
      
      // Clear localStorage to force fresh data fetch
      console.log('🧹 Clearing localStorage for fresh sync...');
      localStorage.removeItem('sorties_conteneurs');
      
      // Reload all data to ensure complete synchronization
      console.log('🔄 Reloading all data for synchronization...');
      await loadSorties();
      
      toast({
        title: "Retour confirmé",
        description: "Le retour au port a été enregistré."
      });

      // Reset form
      setIsReturnDialogOpen(false);
      setSelectedSortie(null);
      setReturnData({ dateRetour: "", camionRetour: "", remorqueRetour: "" });
      
      console.log('✅ Return confirmation completed successfully');
    } catch (error) {
      console.error('❌ Error during return confirmation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation du retour",
        variant: "destructive"
      });
    }
  }, [selectedSortie, returnData, toast, loadSorties]);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
    setEditingSortie(null);
    setFormData(getEmptyFormData());
  }, []);

  const getSortiesEnCours = useCallback(() => {
    const filtered = sorties.filter(s => {
      // Exclude containers that are returned (either by status OR by having a return date)
      const isReturned = s.statut === "retourne_port" || !!s.dateRetour;
      console.log('🔍 Filtering sortie:', { 
        id: s.id, 
        statut: s.statut, 
        dateRetour: s.dateRetour,
        isReturned,
        includeInEnCours: !isReturned
      });
      return !isReturned;
    });
    console.log('📊 Sorties en cours final result:', filtered.length, 'out of', sorties.length);
    console.log('📋 En cours IDs:', filtered.map(s => s.id));
    return filtered;
  }, [sorties]);

  const getHistorique = useCallback(() => {
    console.log('📚 Historique includes all sorties:', sorties.map(s => ({ id: s.id, statut: s.statut })));
    return sorties;
  }, [sorties]);

  return {
    // État
    sorties,
    loading,
    isAddDialogOpen,
    isReturnDialogOpen,
    selectedSortie,
    editingSortie,
    formData,
    returnData,

    // Setters
    setIsAddDialogOpen,
    setIsReturnDialogOpen,
    setFormData,
    setReturnData,

    // Actions
    handleSubmit,
    handleEdit,
    handleDelete,
    handleReturnClick,
    handleConfirmReturn,
    handleCloseAddDialog,
    loadSorties,

    // Getters
    getSortiesEnCours,
    getHistorique
  };
}