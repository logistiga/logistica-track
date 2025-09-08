import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { StockageTab } from "@/components/base/StockageTab";
import { DoubleRelevageTab } from "@/components/base/DoubleRelevageTab";
import { DepotageTab } from "@/components/base/DepotageTab";
import { ArriveeBaseTab } from "@/components/base/ArriveeBaseTab";
import { BaseHeader } from "@/components/base/shared/BaseHeader";
import { useVehicules } from "@/hooks/useVehicules";

export default function Base() {
  const { camions, remorques, loading } = useVehicules();

  // Transform data to match expected interface
  const transformedCamions = camions.map(camion => ({
    id: camion.id.toString(),
    numeroParc: camion.numero_parc,
    immatriculation: camion.immatriculation,
    statut: camion.actif ? "disponible" : "maintenance"
  }));

  const transformedRemorques = remorques.map(remorque => ({
    id: remorque.id.toString(),
    numeroParc: remorque.numero_parc,
    immatriculation: remorque.immatriculation,
    statut: remorque.actif ? "disponible" : "maintenance"
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des véhicules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BaseHeader 
        title="Gestion de la Base"
        description="Stockage, double relevage et dépotage des conteneurs"
      />

      {/* Tabs */}
      <Tabs defaultValue="arrivees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="arrivees">Arrivées Base</TabsTrigger>
          <TabsTrigger value="stockage">Stockage</TabsTrigger>
          <TabsTrigger value="double-relevage">Double Relevage</TabsTrigger>
          <TabsTrigger value="depotage">Dépotage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arrivees">
          <ArriveeBaseTab camions={transformedCamions} remorques={transformedRemorques} />
        </TabsContent>

        <TabsContent value="stockage">
          <StockageTab camions={transformedCamions} remorques={transformedRemorques} />
        </TabsContent>

        <TabsContent value="double-relevage">
          <DoubleRelevageTab camions={transformedCamions} remorques={transformedRemorques} />
        </TabsContent>

        <TabsContent value="depotage">
          <DepotageTab camions={transformedCamions} remorques={transformedRemorques} />
        </TabsContent>
      </Tabs>
    </div>
  );
}