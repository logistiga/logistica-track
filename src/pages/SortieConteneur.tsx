import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { SortieFormData, ReturnData } from "@/types/sortie-conteneur";
import { SortieForm } from "@/components/sortie-conteneur/SortieForm";
import { SortieTable } from "@/components/sortie-conteneur/SortieTable";
import { ReturnDialog } from "@/components/sortie-conteneur/ReturnDialog";
import { ExportDialog } from "@/components/sortie-conteneur/ExportDialog";
import { useSortieConteneur } from "@/hooks/useSortieConteneur";

const SortieConteneurPage = () => {
  const [activeTab, setActiveTab] = useState("nouvelle");
  
  const {
    // État
    sorties,
    loading,
    isAddDialogOpen,
    isReturnDialogOpen,
    selectedSortie,
    editingSortie,
    formData,
    returnData,

    // Setters
    setIsAddDialogOpen,
    setIsReturnDialogOpen,
    setFormData,
    setReturnData,

    // Actions
    handleSubmit,
    handleEdit,
    handleDelete,
    handleReturnClick,
    handleConfirmReturn,
    handleCloseAddDialog,

    // Getters
    getSortiesEnCours,
    getHistorique
  } = useSortieConteneur();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des sorties...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sortie de Conteneur</h1>
          <p className="text-muted-foreground">
            Gérez les sorties et le suivi des conteneurs
          </p>
        </div>
        <div className="flex gap-3">
          <ExportDialog sorties={sorties} />
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (open) {
              setIsAddDialogOpen(true);
            } else {
              handleCloseAddDialog();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une nouvelle sortie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSortie ? "Modifier la sortie de conteneur" : "Nouvelle sortie de conteneur"}
                </DialogTitle>
                <DialogDescription>
                  {editingSortie 
                    ? "Modifiez les informations de la sortie de conteneur"
                    : "Enregistrez une nouvelle sortie de conteneur du port"
                  }
                </DialogDescription>
              </DialogHeader>
              <SortieForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCloseAddDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="nouvelle">Sorties en cours</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nouvelle" className="space-y-4">
          <SortieTable
            sorties={getSortiesEnCours()}
            showHistory={false}
            onEditClick={handleEdit}
            onReturnClick={handleReturnClick}
            onDeleteClick={handleDelete}
          />
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <SortieTable sorties={getHistorique()} showHistory={true} />
        </TabsContent>
      </Tabs>

      <ReturnDialog
        isOpen={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        selectedSortie={selectedSortie}
        returnData={returnData}
        setReturnData={setReturnData}
        onConfirmReturn={handleConfirmReturn}
      />
    </div>
  );
};

export default SortieConteneurPage;