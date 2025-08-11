import { useState } from "react";
import { Operation, CreateOperationData } from "@/types/operations";
import { OperationStats } from "@/components/operations/OperationStats";
import { OperationForm } from "@/components/operations/OperationForm";
import { OperationTable } from "@/components/operations/OperationTable";
import { useToast } from "@/hooks/use-toast";

export default function Operations() {
  const { toast } = useToast();
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

  // Mock data for dropdowns
  const camions = [
    { id: "1", numero: "CAM001", marque: "Mercedes", modele: "Actros" },
    { id: "2", numero: "CAM002", marque: "Volvo", modele: "FH" },
    { id: "3", numero: "CAM003", marque: "Scania", modele: "R500" }
  ];

  const remorques = [
    { id: "1", numero: "REM001", type: "Porte-conteneur" },
    { id: "2", numero: "REM002", type: "Semi-remorque" },
    { id: "3", numero: "REM003", type: "Plateau" }
  ];

  const clients = ["Client ABC", "Client XYZ", "Client DEF", "Transport Martin", "Logistics Pro"];

  const handleCreateOperation = (data: CreateOperationData) => {
    const newOperation: Operation = {
      id: Date.now().toString(),
      ...data,
      statut: "en-attente",
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setOperations(prev => [newOperation, ...prev]);
    toast({
      title: "Opération créée",
      description: "La nouvelle opération a été ajoutée avec succès."
    });
  };

  const handleEditOperation = (operation: Operation) => {
    toast({
      title: "Modification",
      description: `Édition de l'opération ${operation.id}`
    });
  };

  const handleDeleteOperation = (operation: Operation) => {
    setOperations(prev => prev.filter(op => op.id !== operation.id));
    toast({
      title: "Opération supprimée",
      description: "L'opération a été supprimée avec succès."
    });
  };

  const handleConfirmOperation = (operation: Operation) => {
    setOperations(prev => prev.map(op =>
      op.id === operation.id
        ? { ...op, statut: "confirmee" as const }
        : op
    ));
    
    toast({
      title: "Opération confirmée",
      description: "L'opération a été transférée vers la facturation."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opérations</h1>
        <p className="text-muted-foreground">
          Gestion des opérations spot de Logistica
        </p>
      </div>

      <OperationStats operations={operations} />

      <OperationForm 
        onSubmit={handleCreateOperation}
        camions={camions}
        remorques={remorques}
        clients={clients}
      />

      <OperationTable
        operations={operations}
        onEdit={handleEditOperation}
        onDelete={handleDeleteOperation}
        onConfirm={handleConfirmOperation}
      />
    </div>
  );
}