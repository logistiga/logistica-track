import { Operation, CreateOperationData } from "@/types/operations";
import { useToast } from "@/hooks/use-toast";

export function useOperations() {
  const { toast } = useToast();

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

  const createOperation = (data: CreateOperationData): Operation => {
    return {
      id: Date.now().toString(),
      ...data,
      statut: "en-attente",
      dateCreation: new Date().toISOString().split('T')[0]
    };
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  return {
    camions,
    remorques,
    clients,
    createOperation,
    showToast
  };
}