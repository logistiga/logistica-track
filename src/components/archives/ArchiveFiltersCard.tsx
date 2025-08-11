import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { ArchiveFilters, EXPORT_FORMATS } from "@/types/archives";
import { DateRangeFilter, ExportButtons, ResetButton } from "@/components/shared/FilterComponents";

interface ArchiveFiltersCardProps {
  filters: ArchiveFilters;
  onFiltersChange: (filters: ArchiveFilters) => void;
  onExport: (format: string) => void;
  clients: string[];
}

export function ArchiveFiltersCard({ 
  filters, 
  onFiltersChange, 
  onExport, 
  clients 
}: ArchiveFiltersCardProps) {
  
  const updateFilter = (key: keyof ArchiveFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateDebut: "",
      dateFin: "",
      typeOperation: "",
      client: "",
      numeroConteneur: "",
      statutPaiement: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtres et Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateRangeFilter
          dateDebut={filters.dateDebut}
          dateFin={filters.dateFin}
          onDateDebutChange={(date) => updateFilter("dateDebut", date)}
          onDateFinChange={(date) => updateFilter("dateFin", date)}
        />

        <div>
          <Label htmlFor="typeOperation">Type d'opération</Label>
          <Select value={filters.typeOperation} onValueChange={(value) => updateFilter("typeOperation", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="stockage">Stockage</SelectItem>
              <SelectItem value="double-relevage">Double relevage</SelectItem>
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
              <SelectItem value="">Tous les clients</SelectItem>
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

        <ResetButton onReset={resetFilters} />
        <ExportButtons onExport={onExport} formats={EXPORT_FORMATS} />
      </CardContent>
    </Card>
  );
}