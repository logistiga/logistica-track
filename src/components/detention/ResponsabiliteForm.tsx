import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DetentionContainer } from "@/types/detention";

interface ResponsabiliteFormProps {
  selectedContainer: DetentionContainer;
  formData: any;
  onFormDataChange: (data: any) => void;
}

export function ResponsabiliteForm({ selectedContainer, formData, onFormDataChange }: ResponsabiliteFormProps) {
  const handleResponsabiliteChange = (value: string) => {
    onFormDataChange({
      ...formData,
      responsabilite: value,
      joursClient: value === "client" ? selectedContainer?.joursDepassement || 0 : 
                   value === "logistiga" ? 0 : formData.joursClient,
      joursLogistiga: value === "logistiga" ? selectedContainer?.joursDepassement || 0 :
                      value === "client" ? 0 : formData.joursLogistiga
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Conteneur: {selectedContainer.numeroConteneur}</Label>
        <Label>Jours de dépassement: {selectedContainer.joursDepassement}</Label>
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
              onChange={(e) => onFormDataChange({
                ...formData,
                joursClient: parseInt(e.target.value) || 0,
                joursLogistiga: selectedContainer.joursDepassement - (parseInt(e.target.value) || 0)
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joursLogistiga">Jours Logistiga</Label>
            <Input
              id="joursLogistiga"
              type="number"
              min="0"
              max={selectedContainer.joursDepassement}
              value={formData.joursLogistiga}
              onChange={(e) => onFormDataChange({
                ...formData,
                joursLogistiga: parseInt(e.target.value) || 0,
                joursClient: selectedContainer.joursDepassement - (parseInt(e.target.value) || 0)
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
}