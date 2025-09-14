import { DetentionContainer } from '@/types/detention';

// Type mapping utilities
export const mapResponsabilite = (backendResponsabilite: string): 'client' | 'logistiga' | 'partagee' | undefined => {
  const mapping: Record<string, 'client' | 'logistiga' | 'partagee'> = {
    'client': 'client',
    'logistiga': 'logistiga', 
    'partagee': 'partagee',
    'shared': 'partagee',
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
  const sortieConteneur = backendData.sortie_conteneur || backendData;
  const joursBAT = calculateJoursBAT(sortieConteneur);
  const joursRealises = calculateJoursRealises(sortieConteneur);
  const joursDepassement = Math.max(0, joursRealises - joursBAT);
  const coutParJour = parseFloat(backendData.cout_par_jour || '25000');
  
  return {
    id: backendData.id?.toString() || '',
    numeroConteneur: sortieConteneur?.numero_conteneur || '',
    codeArmateur: sortieConteneur?.armateur?.code || '',
    typeConteneur: mapTypeConteneur(sortieConteneur?.type_destination),
    joursBAT,
    joursRealises,
    joursDepassement,
    dateSortie: sortieConteneur?.date_sortie || '',
    dateRetour: sortieConteneur?.date_retour || '',
    nomClient: sortieConteneur?.nom_client || '',
    responsabilite: mapResponsabilite(backendData.responsabilite),
    joursClient: parseInt(backendData.jours_client || '0'),
    joursLogistiga: parseInt(backendData.jours_logistiga || '0'),
    coutParJour,
    montantTotal: joursDepassement * coutParJour,
    noteDebitGeneree: backendData.note_debit_generee || false,
    paiementConfirme: backendData.paiement_confirme || false,
  };
};