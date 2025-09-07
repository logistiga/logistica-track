import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Loader2 } from "lucide-react";
import { StockageTab } from "@/components/base/StockageTab";
import { DoubleRelevageTab } from "@/components/base/DoubleRelevageTab";
import { ArriveeBaseTab } from "@/components/base/ArriveeBaseTab";
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
      <Tabs defaultValue="arrivees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="arrivees">Arrivées Base</TabsTrigger>
          <TabsTrigger value="stockage">Stockage</TabsTrigger>
          <TabsTrigger value="double-relevage">Double Relevage</TabsTrigger>
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
      </Tabs>
    </div>
  );
}