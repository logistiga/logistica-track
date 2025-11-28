import { useState, useMemo, useEffect } from "react";
import { ArchiveSortie, ArchiveSortieFilters } from "@/types/archivesSortie";
import { ArchiveSortieStats } from "@/components/archivesSortie/ArchiveSortieStats";
import { ArchiveSortieFiltersDialog } from "@/components/archivesSortie/ArchiveSortieFiltersDialog";
import { ArchiveSortieTable } from "@/components/archivesSortie/ArchiveSortieTable";
import { ArchiveSortieDetailsDialog } from "@/components/archivesSortie/ArchiveSortieDetailsDialog";
import { useArchiveSortie } from "@/hooks/useArchiveSortie";

export default function ArchivesSortie() {
  const { archives, loading, searchArchivesSortie, exportArchivesSortie } = useArchiveSortie();
  const [selectedArchive, setSelectedArchive] = useState<ArchiveSortie | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState<ArchiveSortieFilters>({
    dateDebut: "",
    dateFin: "",
    armateur: "all",
    client: "all",
    numeroConteneur: "",
    statutPaiement: "all"
  });

  useEffect(() => {
    searchArchivesSortie(filters);
  }, [filters]);

  const armateurs = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.codeArmateur)));
  }, [archives]);

  const clients = useMemo(() => {
    return Array.from(new Set(archives.map(a => a.nomClient)));
  }, [archives]);

  const handleExport = (format: string) => {
    exportArchivesSortie(format, filters);
  };

  const handleViewInvoice = (archive: ArchiveSortie) => {
    console.log('Voir note de débit:', archive.numeroFactureDetention);
  };

  const handleViewDetails = (archive: ArchiveSortie) => {
    setSelectedArchive(archive);
    setDetailsDialogOpen(true);
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

      <ArchiveSortieStats archives={archives} />

      <ArchiveSortieTable
        archives={archives}
        onViewInvoice={handleViewInvoice}
        onViewDetails={handleViewDetails}
      />

      <ArchiveSortieDetailsDialog
        archive={selectedArchive}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}