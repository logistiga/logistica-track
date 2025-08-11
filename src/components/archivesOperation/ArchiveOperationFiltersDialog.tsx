import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Download, FileText } from "lucide-react";
import { ArchiveOperationFilters } from "@/types/archivesOperation";
import { DateRangeFilter } from "@/components/shared/FilterComponents";
import { ResetButton } from "@/components/shared/FilterComponents";

interface ArchiveOperationFiltersDialogProps {
  filters: ArchiveOperationFilters;
  onFiltersChange: (filters: ArchiveOperationFilters) => void;
  onExport: (format: string) => void;
  clients: string[];
}

export function ArchiveOperationFiltersDialog({
  filters,
  onFiltersChange,
  onExport,
  clients
}: ArchiveOperationFiltersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof ArchiveOperationFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateDebut: "",
      dateFin: "",
      typeOperation: "all",
      client: "all",
      numeroOperation: "",
      statutPaiement: "all"
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtres
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              •
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres et Export
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DateRangeFilter
            dateDebut={filters.dateDebut}
            dateFin={filters.dateFin}
            onDateDebutChange={(value) => updateFilter("dateDebut", value)}
            onDateFinChange={(value) => updateFilter("dateFin", value)}
          />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'opération</label>
              <Select value={filters.typeOperation} onValueChange={(value) => updateFilter("typeOperation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="double-relevage">Double relevage</SelectItem>
                  <SelectItem value="logistique">Logistique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Client</label>
              <Select value={filters.client} onValueChange={(value) => updateFilter("client", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Numéro d'opération</label>
            <Input
              placeholder="Rechercher par numéro..."
              value={filters.numeroOperation}
              onChange={(e) => updateFilter("numeroOperation", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t">
            <ResetButton onReset={resetFilters} />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => onExport("excel")}
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => onExport("pdf")}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}