import { DetentionContainer } from '@/types/detention';

// Type mapping utilities
export const mapResponsabilite = (backendResponsabilite: string): 'client' | 'logistiga' | 'partagee' | undefined => {
  const mapping: Record<string, 'client' | 'logistiga' | 'partagee'> = {
    'client': 'client',
    'logistiga': 'logistiga', 
    'partagee': 'partagee',
    'shared': 'partagee',
    'autre': 'partagee', // Backend utilise "autre" pour responsabilité partagée
  };
  return mapping[backendResponsabilite?.toLowerCase()] || undefined;
};

export const mapTypeConteneur = (typeDestination: string): string => {
  const mapping: Record<string, string> = {
    'export': 'EXP',
    'import': 'IMP', 
    'transit': 'TRA',
    'local': 'LOC',
  };
  return mapping[typeDestination?.toLowerCase()] || typeDestination || 'N/A';
};

// Calculation utilities
export const calculateJoursBAT = (sortieConteneur: any): number => {
  const typeMap: Record<string, number> = {
    'export': 7,
    'import': 5,
    'transit': 3,
    'local': 7,
  };
  return typeMap[sortieConteneur?.type_destination?.toLowerCase()] || 7;
};

export const calculateJoursRealises = (sortieConteneur: any): number => {
  if (!sortieConteneur?.date_sortie || !sortieConteneur?.date_retour) return 0;
  
  const sortie = new Date(sortieConteneur.date_sortie);
  const retour = new Date(sortieConteneur.date_retour);
  const diffTime = Math.abs(retour.getTime() - sortie.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Main transformation function
export const transformDetentionData = (backendData: any): DetentionContainer => {
  // Les données viennent directement du backend avec la structure aplatie
  const joursBAT = backendData.jours_bat || calculateJoursBAT(backendData);
  const joursRealises = backendData.jours_realises || calculateJoursRealises(backendData);
  const joursDepassement = backendData.jours_depassement || Math.max(0, joursRealises - joursBAT);
  const coutParJour = parseFloat(backendData.cout_par_jour || '0');
  const montantTotal = parseFloat(backendData.cout_total || '0');
  
  return {
    id: backendData.id?.toString() || '',
    numeroConteneur: backendData.numero_conteneur || '',
    codeArmateur: backendData.code_armateur || '',
    typeConteneur: backendData.type_conteneur_label || mapTypeConteneur(backendData.type_destination),
    joursBAT,
    joursRealises,
    joursDepassement,
    dateSortie: backendData.date_sortie || '',
    dateRetour: backendData.date_retour || '',
    nomClient: backendData.nom_client || '',
    responsabilite: mapResponsabilite(backendData.responsabilite),
    joursClient: parseInt(backendData.jours_client || '0'),
    joursLogistiga: parseInt(backendData.jours_logistica || '0'), // Notez "logistica" avec "c"
    coutParJour,
    montantTotal,
    noteDebitGeneree: backendData.note_debit_generee || false,
    paiementConfirme: backendData.paiement_confirme || false,
  };
};