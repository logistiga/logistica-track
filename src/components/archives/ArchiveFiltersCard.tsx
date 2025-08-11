import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { ArchiveFilters, EXPORT_FORMATS } from "@/types/archives";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDebut">Date début</Label>
            <Input
              id="dateDebut"
              type="date"
              value={filters.dateDebut}
              onChange={(e) => updateFilter("dateDebut", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dateFin">Date fin</Label>
            <Input
              id="dateFin"
              type="date"
              value={filters.dateFin}
              onChange={(e) => updateFilter("dateFin", e.target.value)}
            />
          </div>
        </div>

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

        <div className="flex gap-2">
          <Button onClick={resetFilters} variant="outline" className="flex-1">
            Réinitialiser
          </Button>
        </div>

        <div className="border-t pt-4">
          <Label>Exporter les données</Label>
          <div className="flex gap-2 mt-2">
            {EXPORT_FORMATS.map((format) => (
              <Button
                key={format.value}
                onClick={() => onExport(format.value)}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-1" />
                {format.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}