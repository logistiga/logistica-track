import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DetentionContainer } from "@/types/detention";
import { ResponsabiliteSelector } from "./ResponsabiliteSelector";
import { ResponsabiliteForm } from "./ResponsabiliteForm";

interface ResponsabiliteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContainer: DetentionContainer | null;
  onConfirm: (data: any) => void;
}

export const ResponsabiliteDialog = ({
  isOpen,
  onOpenChange,
  selectedContainer,
  onConfirm
}: ResponsabiliteDialogProps) => {
  const [formData, setFormData] = useState({
    responsabilite: "",
    joursClient: 0,
    joursLogistiga: 0
  });

  useEffect(() => {
    if (selectedContainer) {
      setFormData({
        responsabilite: selectedContainer.responsabilite || "",
        joursClient: selectedContainer.joursClient || 0,
        joursLogistiga: selectedContainer.joursLogistiga || 0
      });
    }
  }, [selectedContainer]);

  const handleSubmit = () => {
    if (formData.responsabilite === "partagee") {
      const total = formData.joursClient + formData.joursLogistiga;
      if (total !== selectedContainer?.joursDepassement) {
        alert(`Le total des jours (${total}) doit égaler le dépassement (${selectedContainer?.joursDepassement})`);
        return;
      }
    }
    onConfirm(formData);
  };

  const handleResponsabiliteChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      responsabilite: value,
      joursClient: value === "client" ? selectedContainer?.joursDepassement || 0 : 
                   value === "logistiga" ? 0 : prev.joursClient,
      joursLogistiga: value === "logistiga" ? selectedContainer?.joursDepassement || 0 :
                      value === "client" ? 0 : prev.joursLogistiga
    }));
  };

  if (!selectedContainer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Identifier la responsabilité</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ResponsabiliteSelector 
            value={formData.responsabilite}
            onChange={handleResponsabiliteChange}
          />

          <ResponsabiliteForm
            selectedContainer={selectedContainer}
            formData={formData}
            onFormDataChange={setFormData}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.responsabilite}>
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};