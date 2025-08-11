import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetentionContainer } from "@/types/detention";

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
    joursLogistica: 0
  });

  useEffect(() => {
    if (selectedContainer) {
      setFormData({
        responsabilite: selectedContainer.responsabilite || "",
        joursClient: selectedContainer.joursClient || 0,
        joursLogistica: selectedContainer.joursLogistica || 0
      });
    }
  }, [selectedContainer]);

  const handleSubmit = () => {
    if (formData.responsabilite === "partagee") {
      const total = formData.joursClient + formData.joursLogistica;
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
                   value === "logistica" ? 0 : prev.joursClient,
      joursLogistica: value === "logistica" ? selectedContainer?.joursDepassement || 0 :
                      value === "client" ? 0 : prev.joursLogistica
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
          <div className="space-y-2">
            <Label>Conteneur: {selectedContainer.numeroConteneur}</Label>
            <Label>Jours de dépassement: {selectedContainer.joursDepassement}</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsabilite">Responsabilité</Label>
            <Select value={formData.responsabilite} onValueChange={handleResponsabiliteChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la responsabilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="logistica">Société Logistica</SelectItem>
                <SelectItem value="partagee">Partagée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.responsabilite === "partagee" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joursClient">Jours Client</Label>
                <Input
                  id="joursClient"
                  type="number"
                  min="0"
                  max={selectedContainer.joursDepassement}
                  value={formData.joursClient}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    joursClient: parseInt(e.target.value) || 0,
                    joursLogistica: selectedContainer.joursDepassement - (parseInt(e.target.value) || 0)
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joursLogistica">Jours Logistica</Label>
                <Input
                  id="joursLogistica"
                  type="number"
                  min="0"
                  max={selectedContainer.joursDepassement}
                  value={formData.joursLogistica}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    joursLogistica: parseInt(e.target.value) || 0,
                    joursClient: selectedContainer.joursDepassement - (parseInt(e.target.value) || 0)
                  }))}
                />
              </div>
            </div>
          )}

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