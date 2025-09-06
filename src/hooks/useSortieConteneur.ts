import { useState, useEffect, useCallback } from "react";
import { SortieConteneur, SortieFormData, ReturnData } from "@/types/sortie-conteneur";
import { sortieConteneurService, CreateSortieConteneurData } from "@/services/sortieConteneurService";
import { SortieConteneur as APISortieConteneur } from "@/services/sortieConteneurService";
import { useToast } from "@/hooks/use-toast";
import { validateFormData, getEmptyFormData } from "@/utils/sortieUtils";

// Fonction pour convertir l'API response vers le type local
const convertApiToLocal = (apiSortie: APISortieConteneur): SortieConteneur => ({
  id: apiSortie.id.toString(),
  numeroConteneur: apiSortie.numero_conteneur,
  numeroBL: apiSortie.numero_bl,
  codeArmateur: apiSortie.armateur?.code || apiSortie.armateur_id.toString(),
  camion: apiSortie.vehicule_camion?.numero_parc || apiSortie.vehicule_camion_id?.toString() || "",
  remorque: apiSortie.vehicule_remorque?.numero_parc || apiSortie.vehicule_remorque_id?.toString() || "",
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
  statut: apiSortie.statut as "en_cours" | "a_la_base" | "livre_client" | "retourne_port"
});

export function useSortieConteneur() {
  const { toast } = useToast();
  const [sorties, setSorties] = useState<SortieConteneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState<SortieConteneur | null>(null);
  const [editingSortie, setEditingSortie] = useState<SortieConteneur | null>(null);
  const [formData, setFormData] = useState<SortieFormData>(getEmptyFormData());
  const [returnData, setReturnData] = useState<ReturnData>({
    dateRetour: "",
    camionRetour: "",
    remorqueRetour: ""
  });

  // Chargement initial des données
  useEffect(() => {
    loadSorties();
  }, []);

  const loadSorties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sortieConteneurService.getSorties();
      const convertedData = data.map(convertApiToLocal);
      setSorties(convertedData);
    } catch (error) {
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
        date_sortie: new Date().toISOString().split('T')[0],
        prime_chauffeur: formData.primeChauffeur ? parseInt(formData.primeChauffeur) : undefined,
        jours_bad: formData.joursBAD ? parseInt(formData.joursBAD) : undefined,
        date_fin_franchise: formData.dateFinFranchise,
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
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
      nomTransitaire: sortie.nomTransitaire || ""
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

    try {
      const retourData = {
        date_retour: returnData.dateRetour,
        heure_retour: "12:00",
        camion_retour_id: returnData.camionRetour ? parseInt(returnData.camionRetour) : undefined,
        remorque_retour_id: returnData.remorqueRetour ? parseInt(returnData.remorqueRetour) : undefined
      };

      const updated = await sortieConteneurService.confirmerRetour(parseInt(selectedSortie.id), retourData);
      const convertedUpdated = convertApiToLocal(updated);
      setSorties(prev => prev.map(s => s.id === selectedSortie.id ? convertedUpdated : s));
      toast({
        title: "Retour confirmé",
        description: "Le retour au port a été enregistré."
      });

      // Reset
      setIsReturnDialogOpen(false);
      setSelectedSortie(null);
      setReturnData({ dateRetour: "", camionRetour: "", remorqueRetour: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation du retour",
        variant: "destructive"
      });
    }
  }, [selectedSortie, returnData, toast]);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
    setEditingSortie(null);
    setFormData(getEmptyFormData());
  }, []);

  const getSortiesEnCours = useCallback(() => {
    return sorties.filter(s => s.statut !== "retourne_port");
  }, [sorties]);

  const getHistorique = useCallback(() => {
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