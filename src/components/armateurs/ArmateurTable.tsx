import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Armateur } from "@/services/armateurService";
import { getStatusBadge, filterArmateurs } from "@/utils/armateurUtils";

interface ArmateurTableProps {
  armateurs: Armateur[];
  searchTerm: string;
  onDelete: (id: number) => void;
}

export function ArmateurTable({ armateurs, searchTerm, onDelete }: ArmateurTableProps) {
  const filteredArmateurs = filterArmateurs(armateurs, searchTerm);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Type Conteneur</TableHead>
          <TableHead>Jours Gratuits</TableHead>
          <TableHead>Prix/Jour</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredArmateurs.map((armateur) => (
          <TableRow key={armateur.id}>
            <TableCell>
              <Badge variant="outline" className="font-mono text-xs">
                {armateur.code}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{armateur.nom}</TableCell>
            <TableCell>{armateur.type_conteneur}</TableCell>
            <TableCell className="text-center">{armateur.jours_gratuits}</TableCell>
            <TableCell className="text-right font-mono">
              {armateur.prix_par_jour.toLocaleString()} F CFA
            </TableCell>
            <TableCell>{armateur.contact_nom || '-'}</TableCell>
            <TableCell>{armateur.contact_email || '-'}</TableCell>
            <TableCell>{getStatusBadge(armateur.actif)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(armateur.id)}
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