import { useState } from "react";
import { Operation } from "@/types/operations";
import { OperationStats } from "@/components/operations/OperationStats";
import { OperationDialog } from "@/components/operations/OperationDialog";
import { OperationTable } from "@/components/operations/OperationTable";
import { useOperations } from "@/hooks/useOperations";
import { useDataFlow } from "@/hooks/useDataFlow";
import { DataFlowIndicator } from "@/components/shared/DataFlowIndicator";

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
    showToast 
  } = useOperations();
  const { transferToFacturation } = useDataFlow();

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

  const handleTransfer = (destination: string) => {
    const confirmedOperations = operations.filter(op => op.statut === "confirmee");
    if (confirmedOperations.length > 0) {
      transferToFacturation(confirmedOperations, "Opérations");
    }
  };

  return (
    <div className="space-y-6">
      <DataFlowIndicator 
        currentPage="Operations" 
        showTransferButtons={operations.some(op => op.statut === "confirmee")}
        onTransfer={handleTransfer}
      />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Opérations</h1>
          <p className="text-muted-foreground">
            Gestion des opérations spot de Logistiga
          </p>
        </div>
        <OperationDialog 
          onSubmit={handleCreateOperation}
          camions={camions}
          remorques={remorques}
          clients={clients}
        />
      </div>

      <OperationStats operations={operations} />

      <OperationTable
        operations={operations}
        onEdit={handleEditOperation}
        onDelete={handleDeleteOperation}
        onConfirm={handleConfirmOperation}
      />
    </div>
  );
}