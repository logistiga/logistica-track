import { SortieConteneur, SortieFormData } from "@/types/sortie-conteneur";

export interface CreateSortieData extends Omit<SortieFormData, 'joursBAD'> {
  joursBAD?: number;
}

export class SortieService {
  // Simulation d'une base de données locale
  private static storageKey = 'sorties-conteneurs';

  static getAllSorties(): SortieConteneur[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  }

  static createSortie(data: CreateSortieData): SortieConteneur {
    const nouvelleSortie: SortieConteneur = {
      id: Date.now().toString(),
      numeroConteneur: data.numeroConteneur,
      numeroBL: data.numeroBL,
      codeArmateur: data.codeArmateur,
      camion: data.camion,
      remorque: data.remorque,
      primeChauffeur: data.primeChauffeur ? parseInt(data.primeChauffeur) : 0,
      nomClient: data.nomClient,
      destination: data.destination as "base" | "client",
      adresseClient: data.adresseClient,
      typeDestination: data.typeDestination as "bad" | "detention",
      joursBAD: data.joursBAD,
      dateFinFranchise: data.dateFinFranchise,
      nomTransitaire: data.nomTransitaire,
      dateSortie: new Date().toISOString().split('T')[0],
      statut: data.destination === "base" ? "a_la_base" : "livre_client"
    };

    const sorties = this.getAllSorties();
    sorties.push(nouvelleSortie);
    this.saveSorties(sorties);
    
    return nouvelleSortie;
  }

  static updateSortie(id: string, data: CreateSortieData): SortieConteneur | null {
    const sorties = this.getAllSorties();
    const index = sorties.findIndex(s => s.id === id);
    
    if (index === -1) return null;

    const sortieModifiee: SortieConteneur = {
      ...sorties[index],
      numeroConteneur: data.numeroConteneur,
      numeroBL: data.numeroBL,
      codeArmateur: data.codeArmateur,
      camion: data.camion,
      remorque: data.remorque,
      primeChauffeur: data.primeChauffeur ? parseInt(data.primeChauffeur) : 0,
      nomClient: data.nomClient,
      destination: data.destination as "base" | "client",
      adresseClient: data.adresseClient,
      typeDestination: data.typeDestination as "bad" | "detention",
      joursBAD: data.joursBAD,
      dateFinFranchise: data.dateFinFranchise,
      nomTransitaire: data.nomTransitaire,
    };

    sorties[index] = sortieModifiee;
    this.saveSorties(sorties);
    
    return sortieModifiee;
  }

  static deleteSortie(id: string): boolean {
    const sorties = this.getAllSorties();
    const filteredSorties = sorties.filter(s => s.id !== id);
    
    if (filteredSorties.length === sorties.length) return false;
    
    this.saveSorties(filteredSorties);
    return true;
  }

  static confirmReturn(id: string, dateRetour: string): SortieConteneur | null {
    const sorties = this.getAllSorties();
    const index = sorties.findIndex(s => s.id === id);
    
    if (index === -1) return null;

    sorties[index] = {
      ...sorties[index],
      dateRetour,
      statut: "retourne_port"
    };

    this.saveSorties(sorties);
    return sorties[index];
  }

  static getSortiesByStatus(statut?: string): SortieConteneur[] {
    const sorties = this.getAllSorties();
    if (!statut || statut === "tous") return sorties;
    return sorties.filter(s => s.statut === statut);
  }

  static getSortiesEnCours(): SortieConteneur[] {
    return this.getAllSorties().filter(s => s.statut !== "retourne_port");
  }

  static getHistorique(): SortieConteneur[] {
    return this.getAllSorties();
  }

  private static saveSorties(sorties: SortieConteneur[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(sorties));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sorties:', error);
    }
  }

  private static getDefaultData(): SortieConteneur[] {
    return [
      {
        id: "1",
        numeroConteneur: "TCLU5234567",
        numeroBL: "BL001234",
        codeArmateur: "CMA20",
        camion: "1",
        remorque: "1",
        primeChauffeur: 25000,
        nomClient: "CFAO Motors",
        destination: "client",
        adresseClient: "Zone Industrielle, Abidjan",
        typeDestination: "detention",
        nomTransitaire: "BOLLORE LOGISTICS",
        dateSortie: "2024-01-15",
        statut: "en_cours"
      }
    ];
  }

  static searchSorties(term: string): SortieConteneur[] {
    const sorties = this.getAllSorties();
    const searchTerm = term.toLowerCase();
    
    return sorties.filter(sortie => 
      sortie.numeroConteneur.toLowerCase().includes(searchTerm) ||
      sortie.numeroBL.toLowerCase().includes(searchTerm) ||
      sortie.nomClient.toLowerCase().includes(searchTerm) ||
      sortie.codeArmateur.toLowerCase().includes(searchTerm) ||
      sortie.nomTransitaire.toLowerCase().includes(searchTerm)
    );
  }
}