import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CreateVehiculeData } from "@/services/vehiculeService";

interface VehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehiculeData) => Promise<boolean>;
  activeTab: string;
}

interface VehicleFormData {
  numero_parc: string;
  immatriculation: string;
}

export function VehicleDialog({ isOpen, onClose, onSubmit, activeTab }: VehicleDialogProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    numero_parc: "",
    immatriculation: ""
  });

  const resetForm = () => {
    setFormData({
      numero_parc: "",
      immatriculation: ""
    });
  };

  const handleSubmit = async () => {
    if (!formData.numero_parc || !formData.immatriculation) {
      return;
    }

    const vehicleData: CreateVehiculeData = {
      numero_parc: formData.numero_parc,
      immatriculation: formData.immatriculation,
      type: activeTab === "camions" ? "camion" : "remorque",
      actif: true,
    };

    const success = await onSubmit(vehicleData);
    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajouter un nouveau {activeTab === "camions" ? "camion" : "remorque"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="numeroParc">Numéro de Parc *</Label>
            <Input
              id="numeroParc"
              value={formData.numero_parc}
              onChange={(e) => setFormData({ ...formData, numero_parc: e.target.value })}
              placeholder="Ex: TR 37"
            />
          </div>
          <div>
            <Label htmlFor="immatriculation">Immatriculation *</Label>
            <Input
              id="immatriculation"
              value={formData.immatriculation}
              onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
              placeholder="Ex: LC-362-AA"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}