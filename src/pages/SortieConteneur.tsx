import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { SortieStats } from "@/components/sortie-conteneur/SortieStats";
import { SortieTable } from "@/components/sortie-conteneur/SortieTable";
import { SortieForm } from "@/components/sortie-conteneur/SortieForm";
import { ReturnDialog } from "@/components/sortie-conteneur/ReturnDialog";
import { ExportDialog } from "@/components/sortie-conteneur/ExportDialog";
import { useSortieConteneur } from "@/hooks/useSortieConteneur";

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

  const sortiesEnCours = getSortiesEnCours();
  const historique = getHistorique();

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sorties de Conteneurs</h1>
          <p className="text-muted-foreground">
            Gestion des sorties de conteneurs du port
          </p>
        </div>
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
            Sorties en cours ({sortiesEnCours.length})
          </TabsTrigger>
          <TabsTrigger value="historique">
            Historique ({historique.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          <SortieTable
            sorties={sortiesEnCours}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReturn={handleReturnClick}
            showReturnAction={true}
          />
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <SortieTable
            sorties={historique}
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