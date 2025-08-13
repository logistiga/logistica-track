import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { mockArmateurService } from "@/services/mockArmateurService";
import type { Armateur, CreateArmateurData } from "@/services/armateurService";
import { ArmateurHeader } from "@/components/armateurs/ArmateurHeader";
import { ArmateurStatsCards } from "@/components/armateurs/ArmateurStatsCards";
import { ArmateurTable } from "@/components/armateurs/ArmateurTable";
import { ArmateurDialog } from "@/components/armateurs/ArmateurDialog";
import { toast } from "@/hooks/use-toast";

export default function Armateurs() {
  const [armateurs, setArmateurs] = useState<Armateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser directement le service mock pour éviter les erreurs CORS
  const fetchArmateurs = async () => {
    try {
      setLoading(true);
      console.log("Fetching armateurs using mock service...");
      const data = await mockArmateurService.getArmateurs();
      setArmateurs(data);
      console.log("Armateurs loaded successfully:", data.length);
    } catch (error) {
      console.error("Error loading armateurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les armateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createArmateur = async (data: CreateArmateurData): Promise<boolean> => {
    try {
      console.log("Creating armateur:", data);
      const newArmateur = await mockArmateurService.createArmateur(data);
      setArmateurs(prev => [...prev, newArmateur]);
      toast({
        title: "Succès",
        description: "Armateur créé avec succès",
      });
      return true;
    } catch (error) {
      console.error("Error creating armateur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteArmateur = async (id: number): Promise<boolean> => {
    try {
      console.log("Deleting armateur:", id);
      await mockArmateurService.deleteArmateur(id);
      setArmateurs(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Succès",
        description: "Armateur supprimé avec succès",
      });
      return true;
    } catch (error) {
      console.error("Error deleting armateur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteArmateur = async (id: number) => {
    await deleteArmateur(id);
  };

  useEffect(() => {
    console.log("Armateurs component mounted, fetching armateurs...");
    fetchArmateurs();
  }, []);

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