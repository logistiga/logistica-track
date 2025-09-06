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
  type_conteneur: string;
  jours_gratuits: string;
  prix_par_jour: string;
  contact_nom: string;
  contact_email: string;
  contact_telephone: string;
  adresse: string;
}

export function ArmateurDialog({ isOpen, onClose, onSubmit }: ArmateurDialogProps) {
  const [formData, setFormData] = useState<ArmateurFormData>({
    code: "",
    nom: "",
    type_conteneur: "",
    jours_gratuits: "0",
    prix_par_jour: "0",
    contact_nom: "",
    contact_email: "",
    contact_telephone: "",
    adresse: "",
  });

  const resetForm = () => {
    setFormData({
      code: "",
      nom: "",
      type_conteneur: "",
      jours_gratuits: "0",
      prix_par_jour: "0",
      contact_nom: "",
      contact_email: "",
      contact_telephone: "",
      adresse: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.nom || !formData.type_conteneur) {
      return;
    }

    const armateurData: CreateArmateurData = {
      code: formData.code,
      nom: formData.nom,
      type_conteneur: formData.type_conteneur,
      jours_gratuits: parseInt(formData.jours_gratuits) || 0,
      prix_par_jour: parseFloat(formData.prix_par_jour) || 0,
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
            <Label htmlFor="type_conteneur">Type de Conteneur *</Label>
            <Input
              id="type_conteneur"
              value={formData.type_conteneur}
              onChange={(e) => setFormData({ ...formData, type_conteneur: e.target.value })}
              placeholder="Ex: 20' sec, 40' sec"
            />
          </div>
          <div>
            <Label htmlFor="jours_gratuits">Jours Gratuits *</Label>
            <Input
              id="jours_gratuits"
              type="number"
              value={formData.jours_gratuits}
              onChange={(e) => setFormData({ ...formData, jours_gratuits: e.target.value })}
              placeholder="Nombre de jours"
            />
          </div>
          <div>
            <Label htmlFor="prix_par_jour">Prix par Jour (F CFA) *</Label>
            <Input
              id="prix_par_jour"
              type="number"
              value={formData.prix_par_jour}
              onChange={(e) => setFormData({ ...formData, prix_par_jour: e.target.value })}
              placeholder="Prix en F CFA"
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