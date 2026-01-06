import type { Armateur } from '@/services/armateurService';

/**
 * Filtrer les armateurs par recherche
 */
export const filterArmateurs = (
  armateurs: Armateur[],
  searchTerm: string
): Armateur[] => {
  if (!searchTerm.trim()) return armateurs;
  
  const term = searchTerm.toLowerCase();
  return armateurs.filter(
    a => a.code.toLowerCase().includes(term) ||
         a.nom.toLowerCase().includes(term) ||
         a.type_conteneur.toLowerCase().includes(term)
  );
};

/**
 * Formater le prix en FCFA
 */
export const formatPrix = (prix: number): string => {
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
};

/**
 * Générer le libellé complet d'un armateur
 */
export const getArmateurLabel = (armateur: Armateur): string => {
  return `${armateur.code} - ${armateur.nom}`;
};

/**
 * Générer les options pour un select
 */
export const getArmateurSelectOptions = (armateurs: Armateur[]) => {
  return armateurs.map(a => ({
    value: a.code,
    label: `${a.code} - ${a.nom}`,
  }));
};

/**
 * Grouper les armateurs par type de conteneur
 */
export const groupByTypeConteneur = (armateurs: Armateur[]): Record<string, Armateur[]> => {
  return armateurs.reduce((acc, armateur) => {
    const type = armateur.type_conteneur;
    if (!acc[type]) acc[type] = [];
    acc[type].push(armateur);
    return acc;
  }, {} as Record<string, Armateur[]>);
};
