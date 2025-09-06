import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Vehicule } from "@/services/vehiculeService";

interface VehicleTableProps {
  vehicles: Vehicule[];
  searchTerm: string;
  onDelete: (id: number) => void;
  onEdit: (vehicle: Vehicule) => void;
}

export function VehicleTable({ vehicles, searchTerm, onDelete, onEdit }: VehicleTableProps) {
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.numero_parc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {filteredVehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Aucun véhicule trouvé
              </TableCell>
            </TableRow>
          ) : (
            filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.numero_parc}</TableCell>
                <TableCell>{vehicle.immatriculation}</TableCell>
                <TableCell className="capitalize">{vehicle.type}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    Actif
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}