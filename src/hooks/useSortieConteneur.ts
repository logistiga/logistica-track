import { useState, useEffect, useCallback } from "react";
import { SortieConteneur, SortieFormData, ReturnData } from "@/types/sortie-conteneur";
import { SortieService, CreateSortieData } from "@/services/sortieService";
import { useToast } from "@/hooks/use-toast";
import { validateFormData, getEmptyFormData } from "@/utils/sortieUtils";

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
      const data = SortieService.getAllSorties();
      setSorties(data);
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
      const createData: CreateSortieData = {
        ...formData,
        joursBAD: formData.joursBAD ? parseInt(formData.joursBAD) : undefined
      };

      if (editingSortie) {
        // Mode modification
        const updated = SortieService.updateSortie(editingSortie.id, createData);
        if (updated) {
          setSorties(prev => prev.map(s => s.id === editingSortie.id ? updated : s));
          toast({
            title: "Sortie modifiée",
            description: "Les modifications ont été enregistrées."
          });
        }
        setEditingSortie(null);
      } else {
        // Mode création
        const nouvelleSortie = SortieService.createSortie(createData);
        setSorties(prev => [...prev, nouvelleSortie]);
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
      primeChauffeur: sortie.primeChauffeur.toString(),
      nomClient: sortie.nomClient,
      destination: sortie.destination,
      adresseClient: sortie.adresseClient || "",
      typeDestination: sortie.typeDestination,
      joursBAD: sortie.joursBAD?.toString() || "",
      dateFinFranchise: sortie.dateFinFranchise || "",
      nomTransitaire: sortie.nomTransitaire
    });
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback((sortie: SortieConteneur) => {
    if (SortieService.deleteSortie(sortie.id)) {
      setSorties(prev => prev.filter(s => s.id !== sortie.id));
      toast({
        title: "Sortie supprimée",
        description: "La sortie de conteneur a été supprimée."
      });
    }
  }, [toast]);

  const handleReturnClick = useCallback((sortie: SortieConteneur) => {
    setSelectedSortie(sortie);
    setIsReturnDialogOpen(true);
  }, []);

  const handleConfirmReturn = useCallback(() => {
    if (!selectedSortie || !returnData.dateRetour) return;

    const updated = SortieService.confirmReturn(selectedSortie.id, returnData.dateRetour);
    if (updated) {
      setSorties(prev => prev.map(s => s.id === selectedSortie.id ? updated : s));
      toast({
        title: "Retour confirmé",
        description: "Le retour au port a été enregistré."
      });
    }

    // Reset
    setIsReturnDialogOpen(false);
    setSelectedSortie(null);
    setReturnData({ dateRetour: "", camionRetour: "", remorqueRetour: "" });
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