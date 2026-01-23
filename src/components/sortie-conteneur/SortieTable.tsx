import { useEffect, useState } from "react";
import { SortieConteneur } from "@/types/sortie-conteneur";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { DetentionStatusButton } from "./DetentionStatusButton";

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

  // Réinitialiser à la page 1 si le nombre de sorties change (évite setState dans le render)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

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
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">N° Conteneur</TableHead>
                <TableHead className="min-w-[130px]">N° BL</TableHead>
                <TableHead className="min-w-[80px]">Armateur</TableHead>
                <TableHead className="min-w-[120px]">Client</TableHead>
                <TableHead className="min-w-[60px] text-center">Camion</TableHead>
                <TableHead className="min-w-[70px] text-center">Remorque</TableHead>
                <TableHead className="min-w-[100px]">Date Sortie</TableHead>
                {!showReturnAction && <TableHead className="min-w-[100px]">Date Retour</TableHead>}
                <TableHead className="min-w-[100px]">Statut</TableHead>
                <TableHead className="min-w-[120px]">Détention</TableHead>
                <TableHead className="min-w-[100px] text-right">Prime</TableHead>
                <TableHead className="min-w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((sortie) => (
                <TableRow key={sortie.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {sortie.numeroConteneur}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{sortie.numeroBL}</TableCell>
                  <TableCell className="text-xs">{sortie.codeArmateur}</TableCell>
                  <TableCell className="text-xs max-w-[150px] truncate" title={sortie.nomClient}>
                    {sortie.nomClient}
                  </TableCell>
                  <TableCell className="text-center text-xs">{sortie.camion}</TableCell>
                  <TableCell className="text-center text-xs">{sortie.remorque}</TableCell>
                  <TableCell className="text-xs">{new Date(sortie.dateSortie).toLocaleDateString('fr-FR')}</TableCell>
                  {!showReturnAction && (
                    <TableCell className="text-xs">
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
                  <TableCell className="text-right text-xs font-medium whitespace-nowrap">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(sortie.primeChauffeur)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(sortie)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(sortie)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(sortie)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {showReturnAction && (sortie.statut === "en_cours" || sortie.statut === "livre_client" || sortie.statut === "a_la_base") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReturn(sortie)}
                          title="Confirmer le retour"
                          className="text-primary h-8 px-2 text-xs"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Retour
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        
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