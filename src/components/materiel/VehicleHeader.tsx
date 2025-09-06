import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, Plus } from "lucide-react";

interface VehicleHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  activeTab: string;
}

export function VehicleHeader({ searchTerm, onSearchChange, onAddClick, activeTab }: VehicleHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary rounded-xl">
            <Truck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Véhicules</h1>
            <p className="text-muted-foreground">Gérez votre flotte de camions et remorques</p>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau {activeTab === "camions" ? "Camion" : "Remorque"}
        </Button>
      </div>
    </>
  );
}