import { useState } from "react";
import { Operation } from "@/types/operations";
import { OperationStats } from "@/components/operations/OperationStats";
import { OperationDialog } from "@/components/operations/OperationDialog";
import { OperationTable } from "@/components/operations/OperationTable";
import { OperationFilters } from "@/components/operations/OperationFilters";
import { useOperations } from "@/hooks/useOperations";
import { useDataFlow } from "@/hooks/useDataFlow";
import { DataFlowIndicator } from "@/components/shared/DataFlowIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { operationPdfService } from "@/services/operationPdfService";

export default function Operations() {
  const { 
    operations, 
    camions, 
    remorques, 
    clients, 
    loading,
    createOperation,
    updateOperation,
    deleteOperation,
    confirmOperation,
    startOperation,
    completeOperation,
    showToast 
  } = useOperations();
  const { transferToFacturation } = useDataFlow();

  const [filters, setFilters] = useState({
    typeOperation: "all",
    statut: "all",
    dateDebut: "",
    dateFin: "",
    search: ""
  });

  // Filtrer les opérations
  const filteredOperations = Array.isArray(operations) ? operations.filter((op) => {
    if (filters.typeOperation !== "all" && op.typeOperation !== filters.typeOperation) return false;
    if (filters.statut !== "all" && op.statut !== filters.statut) return false;
    if (filters.dateDebut && op.dateDebut < filters.dateDebut) return false;
    if (filters.dateFin && op.dateDebut > filters.dateFin) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return op.client.toLowerCase().includes(search) || 
             op.camion.toLowerCase().includes(search) ||
             op.remorque.toLowerCase().includes(search);
    }
    return true;
  }) : [];

  // Séparer par onglets
  const operationsEnCours = filteredOperations.filter(op => op.statut === "en-cours" || op.statut === "en-attente");
  const operationsTerminees = filteredOperations.filter(op => op.statut === "terminee");
  const operationsConfirmees = filteredOperations.filter(op => op.statut === "confirmee");

  const handleCreateOperation = async (data: any) => {
    await createOperation(data);
  };

  const handleEditOperation = async (operation: Operation) => {
    await updateOperation(operation.id, operation);
  };

  const handleDeleteOperation = async (operation: Operation) => {
    await deleteOperation(operation.id);
  };

  const handleConfirmOperation = async (operation: Operation) => {
    await confirmOperation(operation.id);
    transferToFacturation(operation, "Opérations");
  };

  const handleStartOperation = async (operation: Operation) => {
    await startOperation(operation.id);
  };

  const handleCompleteOperation = async (operation: Operation) => {
    await completeOperation(operation.id);
  };

  const handleGeneratePDF = (operation: Operation) => {
    operationPdfService.generateOperationPDF(operation);
    showToast("PDF généré", "Le bon de location a été téléchargé");
  };

  const handleTransfer = (destination: string) => {
    if (operationsConfirmees.length > 0) {
      transferToFacturation(operationsConfirmees, "Opérations");
    }
  };

  const resetFilters = () => {
    setFilters({
      typeOperation: "all",
      statut: "all",
      dateDebut: "",
      dateFin: "",
      search: ""
    });
  };

  return (
    <div className="space-y-6">
      <DataFlowIndicator 
        currentPage="Operations" 
        showTransferButtons={operationsConfirmees.length > 0}
        onTransfer={handleTransfer}
      />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Opérations</h1>
          <p className="text-muted-foreground">
            Gestion des locations, transports et opérations logistiques
          </p>
        </div>
        <OperationDialog 
          onSubmit={handleCreateOperation}
          camions={camions}
          remorques={remorques}
          clients={clients}
        />
      </div>

      <OperationStats operations={filteredOperations} />

      <OperationFilters 
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      <Tabs defaultValue="en-cours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="en-cours">
            En cours ({operationsEnCours.length})
          </TabsTrigger>
          <TabsTrigger value="terminees">
            Terminées ({operationsTerminees.length})
          </TabsTrigger>
          <TabsTrigger value="confirmees">
            Confirmées ({operationsConfirmees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours">
          <OperationTable
            operations={operationsEnCours}
            onEdit={handleEditOperation}
            onDelete={handleDeleteOperation}
            onConfirm={handleConfirmOperation}
            onStart={handleStartOperation}
            onComplete={handleCompleteOperation}
          />
        </TabsContent>

        <TabsContent value="terminees">
          <OperationTable
            operations={operationsTerminees}
            onEdit={handleEditOperation}
            onDelete={handleDeleteOperation}
            onConfirm={handleConfirmOperation}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>

        <TabsContent value="confirmees">
          <OperationTable
            operations={operationsConfirmees}
            onEdit={handleEditOperation}
            onDelete={handleDeleteOperation}
            onConfirm={handleConfirmOperation}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
