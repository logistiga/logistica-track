import { useState } from "react";
import { Operation } from "@/types/operations";
import { OperationStats } from "@/components/operations/OperationStats";
import { OperationDialog } from "@/components/operations/OperationDialog";
import { OperationTable } from "@/components/operations/OperationTable";
import { useOperations } from "@/hooks/useOperations";
import { useDataFlow } from "@/hooks/useDataFlow";
import { DataFlowIndicator } from "@/components/shared/DataFlowIndicator";

export default function Operations() {
  const { camions, remorques, clients, createOperation, showToast } = useOperations();
  const { transferToFacturation } = useDataFlow();
  const [operations, setOperations] = useState<Operation[]>([
    {
      id: "1",
      typeOperation: "transport",
      dateExecution: "2024-01-15",
      camion: "CAM001 - Mercedes Actros",
      remorque: "REM001 - Porte-conteneur",
      client: "Client ABC",
      instructions: "Transport de conteneur du port vers entrepôt",
      montant: 450.00,
      statut: "en-attente",
      dateCreation: "2024-01-14"
    },
    {
      id: "2", 
      typeOperation: "location",
      dateExecution: "2024-01-16",
      camion: "CAM002 - Volvo FH",
      remorque: "REM002 - Semi-remorque",
      client: "Client XYZ",
      instructions: "Location de camion pour 2 jours",
      montant: 300.00,
      statut: "confirmee",
      dateCreation: "2024-01-15"
    }
  ]);

  const handleCreateOperation = (data: any) => {
    const newOperation = createOperation(data);
    setOperations(prev => [newOperation, ...prev]);
    showToast("Opération créée", "La nouvelle opération a été ajoutée avec succès.");
  };

  const handleEditOperation = (operation: Operation) => {
    showToast("Modification", `Édition de l'opération ${operation.id}`);
  };

  const handleDeleteOperation = (operation: Operation) => {
    setOperations(prev => prev.filter(op => op.id !== operation.id));
    showToast("Opération supprimée", "L'opération a été supprimée avec succès.");
  };

  const handleConfirmOperation = (operation: Operation) => {
    setOperations(prev => prev.map(op =>
      op.id === operation.id ? { ...op, statut: "confirmee" as const } : op
    ));
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