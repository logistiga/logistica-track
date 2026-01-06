import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Vehicule } from "@/services/vehiculeService";
import { getStatusLabel, getStatusColor } from "@/utils/vehiculeUtils";

interface VehicleTableProps {
  vehicles: Vehicule[];
  onDelete: (id: number) => void;
  onEdit: (vehicle: Vehicule) => void;
}

export function VehicleTable({ vehicles, onDelete, onEdit }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Aucun véhicule trouvé
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de Parc</TableHead>
            <TableHead>Immatriculation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.numero_parc}</TableCell>
              <TableCell>{vehicle.immatriculation}</TableCell>
              <TableCell className="capitalize">{vehicle.type}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.statut)}`}>
                  {getStatusLabel(vehicle.statut)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                  >
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
    </div>
  );
}