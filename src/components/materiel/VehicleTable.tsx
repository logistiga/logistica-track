import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Vehicule } from "@/services/vehiculeService";
import { getStatusBadge, filterVehicles } from "@/utils/vehiculeUtils";

interface VehicleTableProps {
  vehicles: Vehicule[];
  searchTerm: string;
  onDelete: (id: number) => void;
}

export function VehicleTable({ vehicles, searchTerm, onDelete }: VehicleTableProps) {
  const filteredVehicles = filterVehicles(vehicles, searchTerm);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro de Parc</TableHead>
          <TableHead>Immatriculation</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredVehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">{vehicle.numero_parc}</TableCell>
            <TableCell>{vehicle.immatriculation}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(vehicle.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}