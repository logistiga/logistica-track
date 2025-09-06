import type { Armateur } from "@/services/armateurService";

export const filterArmateurs = (armateurs: Armateur[], searchTerm: string): Armateur[] => {
  return armateurs.filter(armateur =>
    armateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    armateur.type_conteneur.toLowerCase().includes(searchTerm.toLowerCase())
  );
};