import { sortieConteneurService, SortieConteneur } from './sortieConteneurService';
import { apiConfig } from '../config/api';

export interface ArriveeBase {
  id: number;
  numero_conteneur: string;
  numero_bl: string;
  nom_client: string;
  armateur?: {
    nom: string;
    code: string;
  };
  date_sortie: string;
  statut: string;
  destination: string;
}

class ArriveeBaseService {
  async getConteneursPourBase(): Promise<ArriveeBase[]> {
    try {
      // Récupérer toutes les sorties
      const sorties = await sortieConteneurService.getSorties();
      
      // Filtrer celles qui sont destinées à la base et disponibles pour traitement
      console.log('🔍 Sorties récupérées:', sorties);
      console.log('🔍 Sorties filtrées pour destination "base":', sorties.filter(s => s.destination === 'base'));
      
      const arrivees = sorties
        .filter(sortie => {
          const isDestinationBase = sortie.destination === 'base';
          const isStatutValide = sortie.statut === 'en_cours' || sortie.statut === 'livre';
          console.log(`🔍 Conteneur ${sortie.numero_conteneur}: destination=${sortie.destination}, statut=${sortie.statut}, valid=${isDestinationBase && isStatutValide}`);
          return isDestinationBase && isStatutValide;
        })
        .map(sortie => ({
          id: sortie.id,
          numero_conteneur: sortie.numero_conteneur,
          numero_bl: sortie.numero_bl,
          nom_client: sortie.nom_client,
          armateur: sortie.armateur,
          date_sortie: sortie.date_sortie,
          statut: sortie.statut,
          destination: sortie.destination
        }));

      return arrivees;
    } catch (error) {
      console.error('Erreur lors du chargement des conteneurs pour la base:', error);
      return [];
    }
  }

  async confirmerArrivee(sortieId: number): Promise<void> {
    // Cette méthode pourrait être utilisée pour confirmer l'arrivée effective
    // et changer le statut de 'en_cours' à 'a_la_base'
    try {
      await sortieConteneurService.updateSortie(sortieId, {
        // Mise à jour du statut si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation d\'arrivée:', error);
      throw error;
    }
  }

  // Transformer une arrivée vers un stockage
  transformToStockage(arrivee: ArriveeBase) {
    return {
      nomClient: arrivee.nom_client,
      numeroConteneur: arrivee.numero_conteneur,
      provenance: arrivee.armateur?.nom || 'Port de Douala',
    };
  }

  // Transformer une arrivée vers un double relevage
  transformToDoubleRelevage(arrivee: ArriveeBase) {
    return {
      nomClient: arrivee.nom_client,
      numeroConteneur: arrivee.numero_conteneur,
      provenance: arrivee.armateur?.nom || 'Port de Douala',
    };
  }

  // Transformer une arrivée vers un dépotage
  transformToDepotage(arrivee: ArriveeBase) {
    return {
      nomClient: arrivee.nom_client,
      numeroConteneur: arrivee.numero_conteneur,
      provenance: arrivee.armateur?.nom || 'Port de Douala',
    };
  }
}

export const arriveeBaseService = new ArriveeBaseService();