import { useState, useMemo } from "react";
import { ArchiveSortie, ArchiveSortieFilters } from "@/types/archivesSortie";
import { ArchiveSortieStats } from "@/components/archivesSortie/ArchiveSortieStats";
import { ArchiveSortieFiltersDialog } from "@/components/archivesSortie/ArchiveSortieFiltersDialog";
import { ArchiveSortieTable } from "@/components/archivesSortie/ArchiveSortieTable";
import { useToast } from "@/hooks/use-toast";

export default function ArchivesSortie() {
  const { toast } = useToast();
  
  const [archives] = useState<ArchiveSortie[]>([
    {
      id: "1",
      numeroConteneur: "CONT001",
      codeArmateur: "MSC",
      typeConteneur: "20' DRY",
      nomClient: "Client ABC",
      dateSortiePort: "2024-01-10",
      dateRetourPort: "2024-01-18",
      destinationInitiale: "Client",
      joursBAT: 5,
      joursRealises: 8,
      joursDepassement: 3,
      responsabilite: "client",
      montantTotalDetention: 450000,
      dateFacturationDetention: "2024-01-19",
      numeroFactureDetention: "DET-2024-001",
      statutPaiement: "paye",
      pvSortie: "PVS-001",
      pvRentreePort: "PVR-001",
      numeroOrdre: "ORD-2024-001",
      dateArchivage: "2024-01-20"
    },
    {
      id: "2",
      numeroConteneur: "CONT002",
      codeArmateur: "CMA",
      typeConteneur: "40' HC",
      nomClient: "Client XYZ",
      dateSortiePort: "2024-01-12",
      dateRetourPort: "2024-01-15",
      destinationInitiale: "Base",
      joursBAT: 7,
      joursRealises: 3,
      joursDepassement: 0,
      statutPaiement: "sans-frais",
      pvSortie: "PVS-002",
      pvRentreePort: "PVR-002",
      numeroOrdre: "ORD-2024-002",
      dateArchivage: "2024-01-16"
    },
    {
      id: "3",
      numeroConteneur: "CONT003",
      codeArmateur: "MSC",
      typeConteneur: "20' DRY",
      nomClient: "Client DEF",
      dateSortiePort: "2024-01-08",
      dateRetourPort: "2024-01-20",
      destinationInitiale: "Client",
      joursBAT: 7,
      joursRealises: 12,
      joursDepassement: 5,
      responsabilite: "partagee",
      joursClient: 3,
      joursLogistiga: 2,
      montantTotalDetention: 600000,
      dateFacturationDetention: "2024-01-21",
      numeroFactureDetention: "DET-2024-002",
      statutPaiement: "paye",
      dateArchivage: "2024-01-22"
    }
  ]);

  const [filters, setFilters] = useState<ArchiveSortieFilters>({
    dateDebut: "",
    dateFin: "",
    armateur: "all",
    client: "all",
    numeroConteneur: "",
    statutPaiement: "all"
  });

  const armateurs = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.codeArmateur)));
  }, [archives]);

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.nomClient)));
  }, [archives]);

  const filteredArchives = useMemo(() => {
    return archives.filter(archive => {
      const matchesDateRange = (!filters.dateDebut || archive.dateSortiePort >= filters.dateDebut) &&
                              (!filters.dateFin || archive.dateSortiePort <= filters.dateFin);
      const matchesArmateur = filters.armateur === "all" || archive.codeArmateur === filters.armateur;
      const matchesClient = filters.client === "all" || archive.nomClient === filters.client;
      const matchesConteneur = !filters.numeroConteneur || 
                              archive.numeroConteneur.toLowerCase().includes(filters.numeroConteneur.toLowerCase());
      const matchesStatut = filters.statutPaiement === "all" || archive.statutPaiement === filters.statutPaiement;

      return matchesDateRange && matchesArmateur && matchesClient && matchesConteneur && matchesStatut;
    });
  }, [archives, filters]);

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Génération du fichier ${format.toUpperCase()}...`
    });
  };

  const handleViewInvoice = (archive: ArchiveSortie) => {
    toast({
      title: "Note de débit",
      description: `Ouverture de la note de débit ${archive.numeroFactureDetention}`
    });
  };

  const handleViewDetails = (archive: ArchiveSortie) => {
    toast({
      title: "Détails",
      description: `Historique complet du conteneur ${archive.numeroConteneur}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archives Sortie</h1>
        <p className="text-muted-foreground">
          Historique complet des sorties de conteneurs et gestion de détention
        </p>
      </div>

      <div className="flex justify-between items-center">
        <ArchiveSortieFiltersDialog
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          armateurs={armateurs}
          clients={clients}
        />
      </div>

      <ArchiveSortieStats archives={filteredArchives} />

      <ArchiveSortieTable
        archives={filteredArchives}
        onViewInvoice={handleViewInvoice}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}