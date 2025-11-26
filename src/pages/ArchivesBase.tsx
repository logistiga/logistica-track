import { useState, useMemo, useEffect } from "react";
import { ArchiveFilters } from "@/types/archives";
import { ArchiveStats } from "@/components/archives/ArchiveStats";
import { ArchiveFiltersDialog } from "@/components/archives/ArchiveFiltersDialog";
import { ArchiveTable } from "@/components/archives/ArchiveTable";
import { useArchives } from "@/hooks/useArchives";

export default function ArchivesBase() {
  const { archives, loading, searchArchives, exportArchives } = useArchives();
  
  const [filters, setFilters] = useState<ArchiveFilters>({
    dateDebut: "",
    dateFin: "",
    typeOperation: "all",
    client: "all",
    numeroConteneur: "",
    statutPaiement: "all"
  });

  useEffect(() => {
    searchArchives(filters);
  }, [filters]);

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.nomClient)));
  }, [archives]);

  const handleExport = (format: string) => {
    exportArchives(format, filters);
  };

  const handleViewInvoice = (archive: any) => {
    console.log('Voir facture:', archive.numeroFacture);
  };

  const handleViewDetails = (archive: any) => {
    console.log('Voir détails:', archive.numeroConteneur);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archives Base</h1>
        <p className="text-muted-foreground">
          Historique complet des opérations de stockage et double relevage
        </p>
      </div>

      <div className="flex justify-between items-center">
        <ArchiveFiltersDialog
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          clients={clients}
        />
      </div>

      <ArchiveStats archives={archives} />

      <ArchiveTable
        archives={archives}
        onViewInvoice={handleViewInvoice}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}