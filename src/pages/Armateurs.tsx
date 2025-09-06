import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArmateurHeader } from "@/components/armateurs/ArmateurHeader";
import { ArmateurStatsCards } from "@/components/armateurs/ArmateurStatsCards";
import { ArmateurTable } from "@/components/armateurs/ArmateurTable";
import { ArmateurDialog } from "@/components/armateurs/ArmateurDialog";
import { useArmateurs } from "@/hooks/useArmateurs";

import { useState } from "react";

export default function Armateurs() {
  const { 
    armateurs, 
    loading, 
    createArmateur, 
    deleteArmateur 
  } = useArmateurs();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteArmateur = async (id: number) => {
    await deleteArmateur(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des armateurs...</p>
        </div>
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