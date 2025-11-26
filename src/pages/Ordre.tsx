import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdreStats } from "@/components/ordre/OrdreStats";
import { OrdreOperationsTab } from "@/components/ordre/OrdreOperationsTab";
import { OrdreSortiesTab } from "@/components/ordre/OrdreSortiesTab";
import { useOrdre } from "@/hooks/useOrdre";

export default function Ordre() {
  const {
    operations,
    sorties,
    loading,
    updateOperation,
    updateSortie,
    deleteOperation,
    deleteSortie,
    confirmOperation,
    confirmSortie
  } = useOrdre();

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
            onUpdate={updateOperation}
            onDelete={deleteOperation}
            onConfirm={confirmOperation}
          />
        </TabsContent>

        <TabsContent value="sorties">
          <OrdreSortiesTab
            sorties={sorties}
            onUpdate={updateSortie}
            onDelete={deleteSortie}
            onConfirm={confirmSortie}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}