import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { StockageTab } from "@/components/base/StockageTab";
import { DoubleRelevageTab } from "@/components/base/DoubleRelevageTab";

export default function Base() {
  // Mock data for vehicles from Matériel page - En production, ceci viendrait d'une API ou d'un contexte partagé
  const [camions] = useState([
    { id: "1", numeroParc: "TR 37", immatriculation: "TR 37", statut: "disponible" },
    { id: "2", numeroParc: "tr 07", immatriculation: "tr 07", statut: "en_mission" },
    { id: "3", numeroParc: "tr 08", immatriculation: "tr 08", statut: "disponible" },
    { id: "4", numeroParc: "TR 41", immatriculation: "TR 41", statut: "disponible" },
  ]);

  const [remorques] = useState([
    { id: "1", numeroParc: "R 01", immatriculation: "R01", statut: "disponible" },
    { id: "2", numeroParc: "R 02", immatriculation: "R02", statut: "disponible" },
    { id: "3", numeroParc: "R 03", immatriculation: "R03", statut: "en_mission" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary rounded-xl">
          <Building2 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion de la Base</h1>
          <p className="text-muted-foreground">Stockage et double relevage des conteneurs</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stockage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stockage">Stockage</TabsTrigger>
          <TabsTrigger value="double-relevage">Double Relevage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stockage">
          <StockageTab camions={camions} remorques={remorques} />
        </TabsContent>

        <TabsContent value="double-relevage">
          <DoubleRelevageTab camions={camions} remorques={remorques} />
        </TabsContent>
      </Tabs>
    </div>
  );
}