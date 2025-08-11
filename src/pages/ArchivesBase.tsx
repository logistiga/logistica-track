import { useState, useMemo } from "react";
import { ArchiveBase, ArchiveFilters } from "@/types/archives";
import { ArchiveStats } from "@/components/archives/ArchiveStats";
import { ArchiveFiltersCard } from "@/components/archives/ArchiveFiltersCard";
import { ArchiveTable } from "@/components/archives/ArchiveTable";
import { useToast } from "@/hooks/use-toast";

export default function ArchivesBase() {
  console.log("ArchivesBase component is rendering");
  const { toast } = useToast();
  
  const [archives] = useState<ArchiveBase[]>([
    {
      id: "1",
      typeOperation: "stockage",
      numeroConteneur: "CONT001",
      nomClient: "Client ABC",
      provenance: "Port",
      dateArriveeBase: "2024-01-10",
      dateSortieBase: "2024-01-18",
      camionArrivee: "CAM001 - Mercedes Actros",
      remorqueArrivee: "REM001 - Porte-conteneur",
      camionSortie: "CAM002 - Volvo FH",
      remorqueSortie: "REM002 - Semi-remorque",
      joursGratuits: 5,
      joursPayants: 3,
      montantTotalFacture: 350.00,
      dateFacturation: "2024-01-19",
      numeroFacture: "FACT-2024-001",
      statutPaiement: "paye",
      dateArchivage: "2024-01-20"
    },
    {
      id: "2",
      typeOperation: "double-relevage",
      numeroConteneur: "CONT002",
      nomClient: "Client XYZ",
      provenance: "Client",
      dateArriveeBase: "2024-01-12",
      dateSortieBase: "2024-01-12",
      camionArrivee: "CAM003 - Scania R500",
      remorqueArrivee: "REM003 - Plateau",
      montantTotalFacture: 250.00,
      dateFacturation: "2024-01-13",
      numeroFacture: "FACT-2024-002",
      statutPaiement: "paye",
      dateArchivage: "2024-01-14"
    }
  ]);

  const [filters, setFilters] = useState<ArchiveFilters>({
    dateDebut: "",
    dateFin: "",
    typeOperation: "",
    client: "",
    numeroConteneur: "",
    statutPaiement: ""
  });

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.nomClient)));
  }, [archives]);

  const filteredArchives = useMemo(() => {
    return archives.filter(archive => {
      if (filters.dateDebut && archive.dateArriveeBase < filters.dateDebut) return false;
      if (filters.dateFin && archive.dateArriveeBase > filters.dateFin) return false;
      if (filters.typeOperation && archive.typeOperation !== filters.typeOperation) return false;
      if (filters.client && archive.nomClient !== filters.client) return false;
      if (filters.numeroConteneur && !archive.numeroConteneur.includes(filters.numeroConteneur)) return false;
      return true;
    });
  }, [archives, filters]);

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Génération du fichier ${format.toUpperCase()}...`
    });
  };

  const handleViewInvoice = (archive: ArchiveBase) => {
    toast({
      title: "Facture",
      description: `Ouverture de la facture ${archive.numeroFacture}`
    });
  };

  const handleViewDetails = (archive: ArchiveBase) => {
    toast({
      title: "Détails",
      description: `Détails complets de l'opération ${archive.numeroConteneur}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archives Base</h1>
        <p className="text-muted-foreground">
          Historique complet des opérations de stockage et double relevage
        </p>
      </div>

      <ArchiveStats archives={filteredArchives} />

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <ArchiveFiltersCard
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            clients={clients}
          />
        </div>
        <div className="lg:col-span-3">
          <ArchiveTable
            archives={filteredArchives}
            onViewInvoice={handleViewInvoice}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
}