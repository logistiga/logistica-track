import { ArchiveOperationFilters } from "@/types/archivesOperation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/shared/FilterComponents";
import { ResetButton } from "@/components/shared/FilterComponents";
import { Download, FileText } from "lucide-react";

interface ArchiveOperationFiltersCardProps {
  filters: ArchiveOperationFilters;
  onFiltersChange: (filters: ArchiveOperationFilters) => void;
  onExport: (format: string) => void;
  clients: string[];
}

export function ArchiveOperationFiltersCard({
  filters,
  onFiltersChange,
  onExport,
  clients
}: ArchiveOperationFiltersCardProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres et Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateRangeFilter
          dateDebut={filters.dateDebut}
          dateFin={filters.dateFin}
          onDateDebutChange={(value) => updateFilter("dateDebut", value)}
          onDateFinChange={(value) => updateFilter("dateFin", value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <ResetButton onReset={resetFilters} />
          <div className="flex gap-2 flex-1">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onExport("excel")}
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onExport("pdf")}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}