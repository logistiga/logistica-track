import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, CheckCircle, Trash2 } from "lucide-react";
import { SortieConteneur } from "@/types/sortie-conteneur";
import { StatusBadge } from "./StatusBadge";

interface SortieTableProps {
  sorties: SortieConteneur[];
  showHistory?: boolean;
  onEditClick?: (sortie: SortieConteneur) => void;
  onReturnClick?: (sortie: SortieConteneur) => void;
  onDeleteClick?: (sortie: SortieConteneur) => void;
}

export const SortieTable = ({ 
  sorties, 
  showHistory = false, 
  onEditClick, 
  onReturnClick, 
  onDeleteClick 
}: SortieTableProps) => {
  const displayedSorties = showHistory 
    ? sorties 
    : sorties.filter(s => s.statut !== "retourne_port");

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conteneur</TableHead>
              <TableHead>BL</TableHead>
              <TableHead>Armateur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Prime</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Date sortie</TableHead>
              {showHistory && <TableHead>Date retour</TableHead>}
              <TableHead>Statut</TableHead>
              {!showHistory && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSorties.map((sortie) => (
              <TableRow key={sortie.id}>
                <TableCell className="font-medium">{sortie.numeroConteneur}</TableCell>
                <TableCell>{sortie.numeroBL}</TableCell>
                <TableCell>{sortie.codeArmateur}</TableCell>
                <TableCell>{sortie.nomClient}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XOF',
                    minimumFractionDigits: 0 
                  }).format(sortie.primeChauffeur)}
                </TableCell>
                <TableCell>{sortie.destination === "base" ? "Base" : "Client"}</TableCell>
                <TableCell>{sortie.dateSortie}</TableCell>
                {showHistory && <TableCell>{sortie.dateRetour || "-"}</TableCell>}
                <TableCell><StatusBadge statut={sortie.statut} /></TableCell>
                {!showHistory && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEditClick?.(sortie)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onReturnClick?.(sortie)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDeleteClick?.(sortie)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};