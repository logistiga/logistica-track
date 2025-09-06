import { SortieConteneur } from "@/types/sortie-conteneur";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0 
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch {
    return dateString;
  }
};

export const getStatutLabel = (statut: SortieConteneur['statut']): string => {
  const statutLabels: Record<SortieConteneur['statut'], string> = {
    "en_cours": "En cours",
    "livre_client": "Livré client",
    "a_la_base": "À la base",
    "retourne_port": "Retourné au port"
  };
  
  return statutLabels[statut] || statut;
};

export const getDestinationLabel = (destination: SortieConteneur['destination']): string => {
  return destination === "base" ? "Base" : "Client";
};

export const getTypeDestinationLabel = (type: SortieConteneur['typeDestination']): string => {
  return type === "bad" ? "BAD" : "Détention fixe";
};

export const calculateDaysFromDate = (dateString: string): number => {
  if (!dateString) return 0;
  
  try {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch {
    return 0;
  }
};

export const isDateInRange = (date: string, startDate?: string, endDate?: string): boolean => {
  if (!date) return false;
  
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  
  return true;
};

export const filterSortiesBySearch = (sorties: SortieConteneur[], searchTerm: string): SortieConteneur[] => {
  if (!searchTerm.trim()) return sorties;
  
  const term = searchTerm.toLowerCase();
  
  return sorties.filter(sortie => 
    sortie.numeroConteneur.toLowerCase().includes(term) ||
    sortie.numeroBL.toLowerCase().includes(term) ||
    sortie.nomClient.toLowerCase().includes(term) ||
    sortie.codeArmateur.toLowerCase().includes(term) ||
    sortie.nomTransitaire.toLowerCase().includes(term)
  );
};

export const sortSortiesByDate = (sorties: SortieConteneur[], direction: 'asc' | 'desc' = 'desc'): SortieConteneur[] => {
  return [...sorties].sort((a, b) => {
    const dateA = new Date(a.dateSortie).getTime();
    const dateB = new Date(b.dateSortie).getTime();
    
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

export const getEmptyFormData = () => ({
  numeroConteneur: "",
  numeroBL: "",
  codeArmateur: "",
  camion: "",
  remorque: "",
  primeChauffeur: "",
  nomClient: "",
  destination: "",
  adresseClient: "",
  typeDestination: "",
  joursBAD: "",
  dateFinFranchise: "",
  nomTransitaire: "",
  dateSortie: new Date().toISOString().split('T')[0]
});

export const validateFormData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.numeroConteneur?.trim()) {
    errors.push("Le numéro de conteneur est obligatoire");
  }
  
  if (!data.numeroBL?.trim()) {
    errors.push("Le numéro de BL est obligatoire");
  }
  
  if (!data.codeArmateur) {
    errors.push("Le code armateur est obligatoire");
  }
  
  if (!data.camion) {
    errors.push("Le camion est obligatoire");
  }
  
  if (!data.remorque) {
    errors.push("La remorque est obligatoire");
  }
  
  if (!data.nomClient?.trim()) {
    errors.push("Le nom du client est obligatoire");
  }
  
  if (!data.destination) {
    errors.push("La destination est obligatoire");
  }
  
  if (data.destination === "client" && !data.adresseClient?.trim()) {
    errors.push("L'adresse du client est obligatoire pour une livraison client");
  }
  
  if (!data.typeDestination) {
    errors.push("Le type de destination est obligatoire");
  }
  
  if (!data.nomTransitaire?.trim()) {
    errors.push("Le nom du transitaire est obligatoire");
  }
  
  return errors;
};