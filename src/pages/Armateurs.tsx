import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useArmateurs } from "@/hooks/useArmateurs";
import { ArmateurHeader } from "@/components/armateurs/ArmateurHeader";
import { ArmateurStatsCards } from "@/components/armateurs/ArmateurStatsCards";
import { ArmateurTable } from "@/components/armateurs/ArmateurTable";
import { ArmateurDialog } from "@/components/armateurs/ArmateurDialog";

export default function Armateurs() {
  const { armateurs, loading, createArmateur, deleteArmateur } = useArmateurs();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteArmateur = async (id: number) => {
    await deleteArmateur(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des armateurs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ArmateurHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <ArmateurStatsCards armateurs={armateurs} />

      {/* Armateurs Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Liste des Armateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <ArmateurTable 
            armateurs={armateurs} 
            searchTerm={searchTerm}
            onDelete={handleDeleteArmateur}
          />
        </CardContent>
      </Card>

      <ArmateurDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={createArmateur}
      />
    </div>
  );
}