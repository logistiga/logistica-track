import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortieConteneur, ReturnData } from "@/types/sortie-conteneur";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer le retour au port</DialogTitle>
          <DialogDescription>
            Enregistrez le retour du conteneur {selectedSortie?.numeroConteneur} au port
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dateRetour">Date de retour</Label>
            <Input
              id="dateRetour"
              type="date"
              value={returnData.dateRetour}
              onChange={(e) => setReturnData({ ...returnData, dateRetour: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="camionRetour">Camion de retour</Label>
            <Select value={returnData.camionRetour} onValueChange={(value) => setReturnData({ ...returnData, camionRetour: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un camion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAM001">CAM001 - AB123CD</SelectItem>
                <SelectItem value="CAM002">CAM002 - EF456GH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="remorqueRetour">Remorque de retour</Label>
            <Select value={returnData.remorqueRetour} onValueChange={(value) => setReturnData({ ...returnData, remorqueRetour: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une remorque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REM001">REM001 - IJ789KL</SelectItem>
                <SelectItem value="REM002">REM002 - MN012OP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirmReturn}>
            Confirmer le retour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};