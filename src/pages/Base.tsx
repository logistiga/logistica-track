import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { StockageTab } from "@/components/base/StockageTab";
import { DoubleRelevageTab } from "@/components/base/DoubleRelevageTab";

export default function Base() {
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
          <StockageTab />
        </TabsContent>

        <TabsContent value="double-relevage">
          <DoubleRelevageTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}