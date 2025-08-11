import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdreOperation, OrdreSortieStandard, UpdateOrdreOperationData, UpdateOrdreSortieData } from "@/types/ordre";
import { OrdreStats } from "@/components/ordre/OrdreStats";
import { OrdreOperationsTab } from "@/components/ordre/OrdreOperationsTab";
import { OrdreSortiesTab } from "@/components/ordre/OrdreSortiesTab";
import { useToast } from "@/hooks/use-toast";

export default function Ordre() {
  const { toast } = useToast();
  
  const [operations, setOperations] = useState<OrdreOperation[]>([
    {
      id: "1",
      typeOperation: "transport",
      dateExecution: "2024-01-15",
      camion: "CAM001 - Mercedes Actros",
      remorque: "REM001 - Porte-conteneur",
      client: "Client ABC",
      instructions: "Transport de conteneur",
      montant: 450.00,
      statut: "en-attente"
    },
    {
      id: "2",
      typeOperation: "location",
      dateExecution: "2024-01-16",
      camion: "CAM002 - Volvo FH",
      remorque: "REM002 - Semi-remorque",
      client: "Client XYZ",
      instructions: "Location de camion",
      montant: 300.00,
      numeroOrdre: "ORD-2024-001",
      statut: "en-attente"
    }
  ]);

  const [sorties, setSorties] = useState<OrdreSortieStandard[]>([
    {
      id: "1",
      numeroConteneur: "CONT001",
      typeConteneur: "20' DRY",
      codeArmateur: "MSC",
      nomClient: "Client ABC",
      destination: "Base",
      dateSortie: "2024-01-15",
      statut: "en-attente"
    },
    {
      id: "2",
      numeroConteneur: "CONT002",
      typeConteneur: "40' HC",
      codeArmateur: "CMA",
      nomClient: "Client XYZ",
      destination: "Client",
      dateSortie: "2024-01-16",
      pvSortie: "PVS-001",
      pvRentreePort: "PVR-001",
      numeroOrdre: "ORD-2024-002",
      statut: "en-attente"
    }
  ]);

  const handleUpdateOperation = (data: UpdateOrdreOperationData) => {
    setOperations(prev => prev.map(op =>
      op.id === data.id ? { ...op, numeroOrdre: data.numeroOrdre } : op
    ));
    toast({
      title: "Numéro d'ordre ajouté",
      description: "Le numéro d'ordre a été sauvegardé."
    });
  };

  const handleUpdateSortie = (data: UpdateOrdreSortieData) => {
    setSorties(prev => prev.map(sortie =>
      sortie.id === data.id 
        ? { 
            ...sortie, 
            pvSortie: data.pvSortie,
            pvRentreePort: data.pvRentreePort,
            numeroOrdre: data.numeroOrdre
          } 
        : sortie
    ));
    toast({
      title: "Informations mises à jour",
      description: "Les données ont été sauvegardées."
    });
  };

  const handleDeleteOperation = (operation: OrdreOperation) => {
    setOperations(prev => prev.filter(op => op.id !== operation.id));
    toast({
      title: "Opération supprimée",
      description: "L'opération a été supprimée."
    });
  };

  const handleDeleteSortie = (sortie: OrdreSortieStandard) => {
    setSorties(prev => prev.filter(s => s.id !== sortie.id));
    toast({
      title: "Sortie supprimée",
      description: "La sortie a été supprimée."
    });
  };

  const handleConfirmOperation = (operation: OrdreOperation) => {
    setOperations(prev => prev.filter(op => op.id !== operation.id));
    toast({
      title: "Opération validée",
      description: "L'opération a été envoyée vers les Archives Opérations."
    });
  };

  const handleConfirmSortie = (sortie: OrdreSortieStandard) => {
    setSorties(prev => prev.filter(s => s.id !== sortie.id));
    toast({
      title: "Sortie validée",
      description: "La sortie a été envoyée vers les Archives Sortie."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordres</h1>
        <p className="text-muted-foreground">
          Validation finale des opérations et sorties standards
        </p>
      </div>

      <OrdreStats operations={operations} sorties={sorties} />

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Opérations</TabsTrigger>
          <TabsTrigger value="sorties">Sorties standards</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <OrdreOperationsTab
            operations={operations}
            onUpdate={handleUpdateOperation}
            onDelete={handleDeleteOperation}
            onConfirm={handleConfirmOperation}
          />
        </TabsContent>

        <TabsContent value="sorties">
          <OrdreSortiesTab
            sorties={sorties}
            onUpdate={handleUpdateSortie}
            onDelete={handleDeleteSortie}
            onConfirm={handleConfirmSortie}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}