import { useState, useMemo } from "react";
import { ArchiveOperation, ArchiveOperationFilters } from "@/types/archivesOperation";
import { ArchiveOperationStats } from "@/components/archivesOperation/ArchiveOperationStats";
import { ArchiveOperationFiltersCard } from "@/components/archivesOperation/ArchiveOperationFiltersCard";
import { ArchiveOperationTable } from "@/components/archivesOperation/ArchiveOperationTable";
import { useToast } from "@/hooks/use-toast";

export default function ArchivesOperation() {
  const { toast } = useToast();
  
  const [archives] = useState<ArchiveOperation[]>([
    {
      id: "1",
      typeOperation: "transport",
      numeroOperation: "OP-2024-001",
      dateExecution: "2024-01-15",
      camion: "CAM001 - Mercedes Actros",
      remorque: "REM001 - Porte-conteneur",
      client: "Client ABC",
      instructions: "Transport de conteneur du port vers entrepôt",
      montantTotal: 450000,
      dateFacturation: "2024-01-16",
      numeroFacture: "FACT-2024-001",
      statutPaiement: "paye",
      dateArchivage: "2024-01-20"
    },
    {
      id: "2",
      typeOperation: "location",
      numeroOperation: "OP-2024-002",
      dateExecution: "2024-01-16",
      camion: "CAM002 - Volvo FH",
      remorque: "REM002 - Semi-remorque",
      client: "Client XYZ",
      instructions: "Location de camion pour 2 jours",
      montantTotal: 300000,
      dateFacturation: "2024-01-17",
      numeroFacture: "FACT-2024-002",
      statutPaiement: "paye",
      dateArchivage: "2024-01-21"
    },
    {
      id: "3",
      typeOperation: "double-relevage",
      numeroOperation: "OP-2024-003",
      dateExecution: "2024-01-18",
      camion: "CAM003 - MAN TGX",
      remorque: "REM003 - Porte-conteneur",
      client: "Client DEF",
      instructions: "Double relevage conteneur 20 pieds",
      montantTotal: 250000,
      dateFacturation: "2024-01-19",
      numeroFacture: "FACT-2024-003",
      statutPaiement: "paye",
      dateArchivage: "2024-01-22"
    }
  ]);

  const [filters, setFilters] = useState<ArchiveOperationFilters>({
    dateDebut: "",
    dateFin: "",
    typeOperation: "",
    client: "",
    numeroOperation: "",
    statutPaiement: ""
  });

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(archive => archive.client))).sort();
  }, [archives]);

  const filteredArchives = useMemo(() => {
    return archives.filter(archive => {
      const matchesDateRange = (!filters.dateDebut || archive.dateExecution >= filters.dateDebut) &&
                              (!filters.dateFin || archive.dateExecution <= filters.dateFin);
      const matchesType = !filters.typeOperation || archive.typeOperation === filters.typeOperation;
      const matchesClient = !filters.client || archive.client === filters.client;
      const matchesNumero = !filters.numeroOperation || 
                           archive.numeroOperation.toLowerCase().includes(filters.numeroOperation.toLowerCase());
      const matchesStatut = !filters.statutPaiement || archive.statutPaiement === filters.statutPaiement;

      return matchesDateRange && matchesType && matchesClient && matchesNumero && matchesStatut;
    });
  }, [archives, filters]);

  const handleExport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Génération du fichier ${format.toUpperCase()}...`
    });
  };

  const handleViewInvoice = (archive: ArchiveOperation) => {
    toast({
      title: "Facture",
      description: `Affichage de la facture ${archive.numeroFacture}`
    });
  };

  const handleViewDetails = (archive: ArchiveOperation) => {
    toast({
      title: "Détails de l'opération",
      description: `Affichage des détails de l'opération ${archive.numeroOperation}`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archives des Opérations</h1>
        <p className="text-muted-foreground">
          Consultation des opérations archivées et payées
        </p>
      </div>

      <ArchiveOperationStats archives={filteredArchives} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ArchiveOperationFiltersCard
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            clients={clients}
          />
        </div>
        <div className="lg:col-span-3">
          <ArchiveOperationTable
            archives={filteredArchives}
            onViewInvoice={handleViewInvoice}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
}