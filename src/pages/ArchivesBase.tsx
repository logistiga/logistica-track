import { useState, useMemo, useEffect } from "react";
import { ArchiveFilters } from "@/types/archives";
import { ArchiveStats } from "@/components/archives/ArchiveStats";
import { ArchiveFiltersDialog } from "@/components/archives/ArchiveFiltersDialog";
import { ArchiveTable } from "@/components/archives/ArchiveTable";
import { ArchiveDetailsDialog } from "@/components/archives/ArchiveDetailsDialog";
import { useArchives } from "@/hooks/useArchives";
import { archiveBasePdfService } from "@/services/archiveBasePdfService";
import { ArchiveBase } from "@/types/archives";
import { useToast } from "@/hooks/use-toast";

export default function ArchivesBase() {
  const { archives, loading, searchArchives, exportArchives } = useArchives();
  const { toast } = useToast();
  const [selectedArchive, setSelectedArchive] = useState<ArchiveBase | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
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

  const handleViewInvoice = (archive: ArchiveBase) => {
    try {
      archiveBasePdfService.generateArchivePdf(archive);
      toast({
        title: "PDF généré",
        description: `Facture ${archive.numeroFacture} téléchargée avec succès`
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (archive: ArchiveBase) => {
    setSelectedArchive(archive);
    setDetailsDialogOpen(true);
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

      <ArchiveDetailsDialog
        archive={selectedArchive}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}