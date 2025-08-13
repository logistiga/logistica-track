import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CreateArmateurData } from "@/services/armateurService";

interface ArmateurDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateArmateurData) => Promise<boolean>;
}

interface ArmateurFormData {
  code: string;
  nom: string;
  contact_nom: string;
  contact_email: string;
  contact_telephone: string;
  adresse: string;
}

export function ArmateurDialog({ isOpen, onClose, onSubmit }: ArmateurDialogProps) {
  const [formData, setFormData] = useState<ArmateurFormData>({
    code: "",
    nom: "",
    contact_nom: "",
    contact_email: "",
    contact_telephone: "",
    adresse: "",
  });

  const resetForm = () => {
    setFormData({
      code: "",
      nom: "",
      contact_nom: "",
      contact_email: "",
      contact_telephone: "",
      adresse: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.nom) {
      return;
    }

    const armateurData: CreateArmateurData = {
      code: formData.code,
      nom: formData.nom,
      contact_nom: formData.contact_nom || undefined,
      contact_email: formData.contact_email || undefined,
      contact_telephone: formData.contact_telephone || undefined,
      adresse: formData.adresse || undefined,
      actif: true,
    };

    const success = await onSubmit(armateurData);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel armateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Code Unique *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Ex: CMA20"
            />
          </div>
          <div>
            <Label htmlFor="nom">Nom de l'Armateur *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: CMA-CGM"
            />
          </div>
          <div>
            <Label htmlFor="contact_nom">Contact</Label>
            <Input
              id="contact_nom"
              value={formData.contact_nom}
              onChange={(e) => setFormData({ ...formData, contact_nom: e.target.value })}
              placeholder="Nom du contact"
            />
          </div>
          <div>
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="contact@armateur.com"
            />
          </div>
          <div>
            <Label htmlFor="contact_telephone">Téléphone</Label>
            <Input
              id="contact_telephone"
              value={formData.contact_telephone}
              onChange={(e) => setFormData({ ...formData, contact_telephone: e.target.value })}
              placeholder="+221 XX XXX XX XX"
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