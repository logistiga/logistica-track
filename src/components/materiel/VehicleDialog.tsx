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
  marque: string;
  modele: string;
  annee: number;
}

export function VehicleDialog({ isOpen, onClose, onSubmit, activeTab }: VehicleDialogProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    numero_parc: "",
    immatriculation: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear()
  });

  const resetForm = () => {
    setFormData({
      numero_parc: "",
      immatriculation: "",
      marque: "",
      modele: "",
      annee: new Date().getFullYear()
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
      marque: formData.marque || undefined,
      modele: formData.modele || undefined,
      annee: formData.annee,
      statut: "disponible",
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
          {activeTab === "camions" && (
            <>
              <div>
                <Label htmlFor="marque">Marque</Label>
                <Input
                  id="marque"
                  value={formData.marque}
                  onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                  placeholder="Ex: Mercedes"
                />
              </div>
              <div>
                <Label htmlFor="modele">Modèle</Label>
                <Input
                  id="modele"
                  value={formData.modele}
                  onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                  placeholder="Ex: Actros"
                />
              </div>
              <div>
                <Label htmlFor="annee">Année</Label>
                <Input
                  id="annee"
                  type="number"
                  value={formData.annee}
                  onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) || new Date().getFullYear() })}
                  placeholder="2024"
                />
              </div>
            </>
          )}
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