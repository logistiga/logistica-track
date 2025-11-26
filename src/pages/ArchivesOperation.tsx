import { useState, useMemo, useEffect } from "react";
import { ArchiveOperationFilters } from "@/types/archivesOperation";
import { ArchiveOperationStats } from "@/components/archivesOperation/ArchiveOperationStats";
import { ArchiveOperationFiltersDialog } from "@/components/archivesOperation/ArchiveOperationFiltersDialog";
import { ArchiveOperationTable } from "@/components/archivesOperation/ArchiveOperationTable";
import { useArchiveOperation } from "@/hooks/useArchiveOperation";

export default function ArchivesOperation() {
  const { archives, loading, searchArchivesOperation, exportArchivesOperation } = useArchiveOperation();
  
  const [filters, setFilters] = useState<ArchiveOperationFilters>({
    dateDebut: "",
    dateFin: "",
    typeOperation: "all",
    client: "all",
    numeroOperation: "",
    statutPaiement: "all"
  });

  useEffect(() => {
    searchArchivesOperation(filters);
  }, [filters]);

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(archive => archive.client))).sort();
  }, [archives]);

  const handleExport = (format: string) => {
    exportArchivesOperation(format, filters);
  };

  const handleViewInvoice = (archive: any) => {
    console.log('Voir facture:', archive.numeroFacture);
  };

  const handleViewDetails = (archive: any) => {
    console.log('Voir détails:', archive.numeroOperation);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archives des Opérations</h1>
        <p className="text-muted-foreground">
          Consultation des opérations archivées et payées
        </p>
      </div>

      <div className="flex justify-between items-center">
        <ArchiveOperationFiltersDialog
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          clients={clients}
        />
      </div>

      <ArchiveOperationStats archives={archives} />

      <ArchiveOperationTable
        archives={archives}
        onViewInvoice={handleViewInvoice}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}