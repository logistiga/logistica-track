import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { ArchiveSortieFilters, EXPORT_FORMATS } from "@/types/archivesSortie";

interface ArchiveSortieFiltersCardProps {
  filters: ArchiveSortieFilters;
  onFiltersChange: (filters: ArchiveSortieFilters) => void;
  onExport: (format: string) => void;
  armateurs: string[];
  clients: string[];
}

export function ArchiveSortieFiltersCard({ 
  filters, 
  onFiltersChange, 
  onExport, 
  armateurs,
  clients 
}: ArchiveSortieFiltersCardProps) {
  
  const updateFilter = (key: keyof ArchiveSortieFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateDebut: "",
      dateFin: "",
      armateur: "",
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
          <Label htmlFor="armateur">Armateur</Label>
          <Select value={filters.armateur} onValueChange={(value) => updateFilter("armateur", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les armateurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les armateurs</SelectItem>
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

        <div>
          <Label htmlFor="statutPaiement">Statut paiement</Label>
          <Select value={filters.statutPaiement} onValueChange={(value) => updateFilter("statutPaiement", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="paye">Payé</SelectItem>
              <SelectItem value="sans-frais">Sans frais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={resetFilters} variant="outline" className="flex-1">
            Réinitialiser
          </Button>
        </div>

        <div className="border-t pt-4">
          <Label>Exporter les données</Label>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => onExport("excel")}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Excel
            </Button>
            <Button
              onClick={() => onExport("pdf")}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}