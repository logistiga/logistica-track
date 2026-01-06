import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RefreshCw, Plus } from "lucide-react";
import { DoubleRelevageForm } from "./DoubleRelevageForm";
import { DoubleRelevageStats } from "./DoubleRelevageStats";
import { DoubleRelevageSearch } from "./double-relevage/DoubleRelevageSearch";
import { DoubleRelevageTable } from "./double-relevage/DoubleRelevageTable";
import { useDoubleRelevage } from "@/hooks/useDoubleRelevage";
import { transformVehiculesToParc, VehiculeTransform } from "@/utils/baseUtils";

interface DoubleRelevageTabProps {
  camions: VehiculeTransform[];
  remorques: VehiculeTransform[];
}

export function DoubleRelevageTab({ camions, remorques }: DoubleRelevageTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    operations,
    loading,
    searchTerm,
    setSearchTerm,
    handleAddOperation,
    handleConfirmOperation,
    handleDeleteOperation
  } = useDoubleRelevage();

  // Mémoriser les transformations de véhicules
  const camionsParc = useMemo(() => transformVehiculesToParc(camions), [camions]);
  const remorquesParc = useMemo(() => transformVehiculesToParc(remorques), [remorques]);

  const onAddOperation = async (data: any) => {
    const success = await handleAddOperation(data);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DoubleRelevageStats operations={operations} />
      
      <div className="flex items-center justify-between">
        <DoubleRelevageSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Opération
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle opération de double relevage</DialogTitle>
            </DialogHeader>
            <DoubleRelevageForm 
              onSubmit={onAddOperation}
              camionsParc={camionsParc}
              remorquesParc={remorquesParc}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Opérations de Double Relevage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DoubleRelevageTable
            operations={operations}
            onConfirm={handleConfirmOperation}
            onDelete={handleDeleteOperation}
          />
        </CardContent>
      </Card>
    </div>
  );
}
