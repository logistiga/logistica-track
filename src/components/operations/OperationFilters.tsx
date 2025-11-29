import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { OPERATION_TYPES } from "@/types/operations";

interface OperationFiltersProps {
  filters: {
    typeOperation: string;
    statut: string;
    dateDebut: string;
    dateFin: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export function OperationFilters({ filters, onFiltersChange, onReset }: OperationFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="filterType">Type</Label>
            <Select
              value={filters.typeOperation}
              onValueChange={(value) => onFiltersChange({ ...filters, typeOperation: value })}
            >
              <SelectTrigger id="filterType">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {OPERATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filterStatut">Statut</Label>
            <Select
              value={filters.statut}
              onValueChange={(value) => onFiltersChange({ ...filters, statut: value })}
            >
              <SelectTrigger id="filterStatut">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="en-attente">En attente</SelectItem>
                <SelectItem value="en-cours">En cours</SelectItem>
                <SelectItem value="terminee">Terminée</SelectItem>
                <SelectItem value="confirmee">Confirmée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filterDateDebut">Date début</Label>
            <Input
              id="filterDateDebut"
              type="date"
              value={filters.dateDebut}
              onChange={(e) => onFiltersChange({ ...filters, dateDebut: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filterDateFin">Date fin</Label>
            <Input
              id="filterDateFin"
              type="date"
              value={filters.dateFin}
              onChange={(e) => onFiltersChange({ ...filters, dateFin: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="filterSearch">Recherche</Label>
            <Input
              id="filterSearch"
              placeholder="Client, camion..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
