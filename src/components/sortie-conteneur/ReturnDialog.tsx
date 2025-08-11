import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ArrowLeft } from "lucide-react";
import { SortieConteneur, ReturnData } from "@/types/sortie-conteneur";

// Mock data des camions disponibles pour le retour
const camionsDisponibles = [
  { id: "1", numeroParc: "TR 37", immatriculation: "TR 37", statut: "disponible" },
  { id: "2", numeroParc: "TR 41", immatriculation: "TR 41", statut: "disponible" },
  { id: "3", numeroParc: "tr 08", immatriculation: "tr 08", statut: "disponible" },
];

const remorquesDisponibles = [
  { id: "1", numeroParc: "R 01", immatriculation: "R01", statut: "disponible" },
  { id: "2", numeroParc: "R 02", immatriculation: "R02", statut: "disponible" },
];

interface ReturnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSortie: SortieConteneur | null;
  returnData: ReturnData;
  setReturnData: (data: ReturnData) => void;
  onConfirmReturn: () => void;
}

export const ReturnDialog = ({
  isOpen,
  onOpenChange,
  selectedSortie,
  returnData,
  setReturnData,
  onConfirmReturn
}: ReturnDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Confirmer le retour au port
          </DialogTitle>
          <DialogDescription>
            Enregistrez le retour du conteneur {selectedSortie?.numeroConteneur} au port
          </DialogDescription>
        </DialogHeader>

        {selectedSortie && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Informations de la sortie</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Conteneur:</span>
                <p className="font-medium">{selectedSortie.numeroConteneur}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">BL:</span>
                <p className="font-medium">{selectedSortie.numeroBL}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Client:</span>
                <p className="font-medium">{selectedSortie.nomClient}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date sortie:</span>
                <p className="font-medium">{selectedSortie.dateSortie}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dateRetour">Date de retour *</Label>
            <Input
              id="dateRetour"
              type="date"
              value={returnData.dateRetour}
              onChange={(e) => setReturnData({ ...returnData, dateRetour: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camionRetour">Camion de retour *</Label>
              <Select value={returnData.camionRetour} onValueChange={(value) => setReturnData({ ...returnData, camionRetour: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent>
                  {camionsDisponibles.map((camion) => (
                    <SelectItem key={camion.id} value={camion.id}>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        {camion.numeroParc} - {camion.immatriculation}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorqueRetour">Remorque de retour *</Label>
              <Select value={returnData.remorqueRetour} onValueChange={(value) => setReturnData({ ...returnData, remorqueRetour: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent>
                  {remorquesDisponibles.map((remorque) => (
                    <SelectItem key={remorque.id} value={remorque.id}>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        {remorque.numeroParc} - {remorque.immatriculation}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onConfirmReturn}
            disabled={!returnData.dateRetour || !returnData.camionRetour || !returnData.remorqueRetour}
          >
            Confirmer le retour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};