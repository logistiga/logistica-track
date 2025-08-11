import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { ArchiveSortieFilters } from "@/types/archivesSortie";
import { DateRangeFilter, ResetButton } from "@/components/shared/FilterComponents";

interface ArchiveSortieFiltersDialogProps {
  filters: ArchiveSortieFilters;
  onFiltersChange: (filters: ArchiveSortieFilters) => void;
  onExport: (format: string) => void;
  armateurs: string[];
  clients: string[];
}

export function ArchiveSortieFiltersDialog({ 
  filters, 
  onFiltersChange, 
  onExport, 
  armateurs,
  clients 
}: ArchiveSortieFiltersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const updateFilter = (key: keyof ArchiveSortieFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateDebut: "",
      dateFin: "",
      armateur: "all",
      client: "all",
      numeroConteneur: "",
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
            onDateDebutChange={(date) => updateFilter("dateDebut", date)}
            onDateFinChange={(date) => updateFilter("dateFin", date)}
          />

          <div>
            <Label htmlFor="armateur">Armateur</Label>
            <Select value={filters.armateur} onValueChange={(value) => updateFilter("armateur", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les armateurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les armateurs</SelectItem>
                {armateurs.map((armateur) => (
                  <SelectItem key={armateur} value={armateur}>
                    {armateur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
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

          <div>
            <Label htmlFor="numeroConteneur">Numéro conteneur</Label>
            <Input
              id="numeroConteneur"
              value={filters.numeroConteneur}
              onChange={(e) => updateFilter("numeroConteneur", e.target.value)}
              placeholder="Rechercher par numéro..."
            />
          </div>

          <div>
            <Label htmlFor="statutPaiement">Statut paiement</Label>
            <Select value={filters.statutPaiement} onValueChange={(value) => updateFilter("statutPaiement", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paye">Payé</SelectItem>
                <SelectItem value="sans-frais">Sans frais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t">
            <ResetButton onReset={resetFilters} />
            
            <div>
              <Label>Exporter les données</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => onExport("excel")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Excel
                </Button>
                <Button
                  onClick={() => onExport("pdf")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}