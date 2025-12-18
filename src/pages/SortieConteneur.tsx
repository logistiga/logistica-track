import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { SortieStats } from "@/components/sortie-conteneur/SortieStats";
import { SortieTable } from "@/components/sortie-conteneur/SortieTable";
import { SortieForm } from "@/components/sortie-conteneur/SortieForm";
import { ReturnDialog } from "@/components/sortie-conteneur/ReturnDialog";
import { ExportDialog } from "@/components/sortie-conteneur/ExportDialog";
import { SortieSearchBar } from "@/components/sortie-conteneur/SortieSearchBar";
import { useSortieConteneur } from "@/hooks/useSortieConteneur";
import { SortieConteneur } from "@/types/sortie-conteneur";

export default function SortieConteneurPage() {
  const {
    sorties,
    loading,
    isAddDialogOpen,
    isReturnDialogOpen,
    editingSortie,
    selectedSortie,
    formData,
    returnData,
    setFormData,
    setReturnData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleReturnClick,
    handleConfirmReturn,
    handleCloseAddDialog,
    setIsAddDialogOpen,
    setIsReturnDialogOpen,
    getSortiesEnCours,
    getHistorique,
  } = useSortieConteneur();

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction de recherche optimisée avec useMemo
  const filterSorties = useCallback((items: SortieConteneur[], query: string) => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(sortie => 
      sortie.numeroConteneur?.toLowerCase().includes(lowerQuery) ||
      sortie.numeroBL?.toLowerCase().includes(lowerQuery) ||
      sortie.nomClient?.toLowerCase().includes(lowerQuery) ||
      sortie.codeArmateur?.toLowerCase().includes(lowerQuery) ||
      sortie.camion?.toLowerCase().includes(lowerQuery) ||
      sortie.remorque?.toLowerCase().includes(lowerQuery) ||
      sortie.nomTransitaire?.toLowerCase().includes(lowerQuery)
    );
  }, []);

  const sortiesEnCours = useMemo(() => getSortiesEnCours(), [getSortiesEnCours]);
  const historique = useMemo(() => getHistorique(), [getHistorique]);

  // Appliquer la recherche aux listes
  const filteredEnCours = useMemo(() => filterSorties(sortiesEnCours, searchQuery), [sortiesEnCours, searchQuery, filterSorties]);
  const filteredHistorique = useMemo(() => filterSorties(historique, searchQuery), [historique, searchQuery, filterSorties]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Chargement des sorties de conteneurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Sorties de Conteneurs</h1>
          <p className="text-muted-foreground">
            Gestion des sorties de conteneurs du port
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <SortieSearchBar onSearch={setSearchQuery} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(true)}
            >
              Exporter
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Sortie
            </Button>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        sorties={sorties}
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSortie ? "Modifier la sortie" : "Nouvelle sortie de conteneur"}
            </DialogTitle>
          </DialogHeader>
          <SortieForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <SortieStats sorties={sorties} />

      {/* Tabs */}
      <Tabs defaultValue="en-cours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="en-cours">
            Sorties en cours ({filteredEnCours.length}{searchQuery && ` / ${sortiesEnCours.length}`})
          </TabsTrigger>
          <TabsTrigger value="historique">
            Historique ({filteredHistorique.length}{searchQuery && ` / ${historique.length}`})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          <SortieTable
            sorties={filteredEnCours}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReturn={handleReturnClick}
            showReturnAction={true}
          />
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <SortieTable
            sorties={filteredHistorique}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReturn={handleReturnClick}
            showReturnAction={false}
          />
        </TabsContent>
      </Tabs>

      {/* Return Dialog */}
      <ReturnDialog
        open={isReturnDialogOpen}
        sortie={selectedSortie}
        returnData={returnData}
        setReturnData={setReturnData}
        onConfirm={handleConfirmReturn}
        onCancel={() => setIsReturnDialogOpen(false)}
      />
    </div>
  );
}