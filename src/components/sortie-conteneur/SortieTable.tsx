import { SortieConteneur } from "@/types/sortie-conteneur";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { DetentionStatusButton } from "./DetentionStatusButton";
import { Edit, Trash2, CheckCircle, Eye } from "lucide-react";

interface SortieTableProps {
  sorties: SortieConteneur[];
  onEdit: (sortie: SortieConteneur) => void;
  onDelete: (sortie: SortieConteneur) => void;
  onReturn: (sortie: SortieConteneur) => void;
  onView?: (sortie: SortieConteneur) => void;
  showReturnAction?: boolean;
}

export function SortieTable({ 
  sorties, 
  onEdit, 
  onDelete, 
  onReturn, 
  onView,
  showReturnAction = true 
}: SortieTableProps) {
  if (sorties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Aucune sortie de conteneur trouvée.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Conteneur</TableHead>
              <TableHead>N° BL</TableHead>
              <TableHead>Armateur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Camion</TableHead>
              <TableHead>Remorque</TableHead>
              <TableHead>Date Sortie</TableHead>
              {!showReturnAction && <TableHead>Date Retour</TableHead>}
              <TableHead>Statut</TableHead>
              <TableHead>Statut Détention</TableHead>
              <TableHead>Prime Chauffeur</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorties.map((sortie) => (
              <TableRow key={sortie.id}>
                <TableCell className="font-medium">
                  {sortie.numeroConteneur}
                </TableCell>
                <TableCell>{sortie.numeroBL}</TableCell>
                <TableCell>{sortie.codeArmateur}</TableCell>
                <TableCell>{sortie.nomClient}</TableCell>
                <TableCell>{sortie.camion}</TableCell>
                <TableCell>{sortie.remorque}</TableCell>
                <TableCell>{new Date(sortie.dateSortie).toLocaleDateString('fr-FR')}</TableCell>
                {!showReturnAction && (
                  <TableCell>
                    {sortie.dateRetour ? new Date(sortie.dateRetour).toLocaleDateString('fr-FR') : '-'}
                  </TableCell>
                )}
                <TableCell>
                  <StatusBadge statut={sortie.statut} />
                </TableCell>
                <TableCell>
                  <DetentionStatusButton 
                    armateurCode={sortie.codeArmateur}
                    dateSortie={sortie.dateSortie}
                    typeDestination={sortie.typeDestination}
                  />
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(sortie.primeChauffeur)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(sortie)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(sortie)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(sortie)}
                      title="Supprimer"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {showReturnAction && (sortie.statut === "en_cours" || sortie.statut === "livre_client" || sortie.statut === "a_la_base") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReturn(sortie)}
                        title="Confirmer le retour"
                        className="text-primary"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Retour
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};