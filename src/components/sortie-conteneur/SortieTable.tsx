import { useState } from "react";
import { SortieConteneur } from "@/types/sortie-conteneur";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { DetentionStatusButton } from "./DetentionStatusButton";
import { MobileTableWrapper } from "@/components/shared/MobileTableWrapper";
import { SortieTableMobile } from "./SortieTableMobile";
import { Edit, Trash2, CheckCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculer les indices de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorties.length / itemsPerPage);

  // Réinitialiser à la page 1 si le nombre de sorties change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

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
    <>
      {/* Vue mobile avec cartes compactes */}
      <div className="lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {sorties.length} sortie{sorties.length > 1 ? 's' : ''}
          </div>
        </div>
        <SortieTableMobile
          sorties={currentItems}
          onEdit={onEdit}
          onDelete={onDelete}
          onReturn={onReturn}
          onView={onView}
          showReturnAction={showReturnAction}
        />
      </div>

      {/* Vue desktop avec table complète */}
      <Card className="hidden lg:block">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-sm text-muted-foreground">
            {sorties.length} sortie{sorties.length > 1 ? 's' : ''} au total
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Afficher:</span>
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <MobileTableWrapper>
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
            {currentItems.map((sortie) => (
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
          </MobileTableWrapper>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages} • Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, sorties.length)} sur {sorties.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Pagination mobile */}
    {totalPages > 1 && (
      <div className="lg:hidden flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage}/{totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )}
    </>
  );
}