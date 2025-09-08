import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ArrowLeft } from "lucide-react";
import { SortieConteneur, ReturnData } from "@/types/sortie-conteneur";
import { useVehicules } from "@/hooks/useVehicules";

interface ReturnDialogProps {
  open: boolean;
  sortie: SortieConteneur | null;
  returnData: ReturnData;
  setReturnData: (data: ReturnData) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ReturnDialog = ({
  open,
  sortie,
  returnData,
  setReturnData,
  onConfirm,
  onCancel
}: ReturnDialogProps) => {
  // Récupérer les données des véhicules depuis la page Matériel
  const { camions, remorques, loading } = useVehicules();
  
  // Filtrer uniquement les véhicules disponibles
  const camionsDisponibles = camions.filter(camion => camion.actif);
  const remorquesDisponibles = remorques.filter(remorque => remorque.actif);
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Confirmer le retour au port
          </DialogTitle>
          <DialogDescription>
            Enregistrez le retour du conteneur {sortie?.numeroConteneur} au port
          </DialogDescription>
        </DialogHeader>

        {sortie && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Informations de la sortie</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Conteneur:</span>
                <p className="font-medium">{sortie.numeroConteneur}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">BL:</span>
                <p className="font-medium">{sortie.numeroBL}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Client:</span>
                <p className="font-medium">{sortie.nomClient}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date sortie:</span>
                <p className="font-medium">{sortie.dateSortie}</p>
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
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-input z-50">
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Chargement des camions...
                    </SelectItem>
                  ) : camionsDisponibles.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Aucun camion disponible
                    </SelectItem>
                  ) : (
                    camionsDisponibles.map((camion) => (
                      <SelectItem key={camion.id} value={camion.id.toString()} className="hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {camion.numero_parc} - {camion.immatriculation}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorqueRetour">Remorque de retour *</Label>
              <Select value={returnData.remorqueRetour} onValueChange={(value) => setReturnData({ ...returnData, remorqueRetour: value })}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-input z-50">
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Chargement des remorques...
                    </SelectItem>
                  ) : remorquesDisponibles.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Aucune remorque disponible
                    </SelectItem>
                  ) : (
                    remorquesDisponibles.map((remorque) => (
                      <SelectItem key={remorque.id} value={remorque.id.toString()} className="hover:bg-muted">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {remorque.numero_parc} - {remorque.immatriculation}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!returnData.dateRetour || !returnData.camionRetour || !returnData.remorqueRetour}
          >
            Confirmer le retour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};