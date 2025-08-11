import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Truck, CalendarDays } from "lucide-react";
import { SortieFormData } from "@/types/sortie-conteneur";

interface SortieFormProps {
  formData: SortieFormData;
  setFormData: (data: SortieFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SortieForm = ({ formData, setFormData, onSubmit, onCancel }: SortieFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Informations conteneur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Informations sur le conteneur
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="numeroConteneur">Numéro de conteneur</Label>
            <Input
              id="numeroConteneur"
              value={formData.numeroConteneur}
              onChange={(e) => setFormData({ ...formData, numeroConteneur: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="numeroVL">Numéro de VL</Label>
            <Input
              id="numeroVL"
              value={formData.numeroVL}
              onChange={(e) => setFormData({ ...formData, numeroVL: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="codeArmateur">Code armateur</Label>
            <Select value={formData.codeArmateur} onValueChange={(value) => setFormData({ ...formData, codeArmateur: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARM001">ARM001 - CMA CGM</SelectItem>
                <SelectItem value="ARM002">ARM002 - MSC</SelectItem>
                <SelectItem value="ARM003">ARM003 - Maersk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transport et destination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Transport et destination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="camion">Numéro de camion</Label>
              <Select value={formData.camion} onValueChange={(value) => setFormData({ ...formData, camion: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAM001">CAM001 - AB123CD</SelectItem>
                  <SelectItem value="CAM002">CAM002 - EF456GH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorque">Numéro de remorque</Label>
              <Select value={formData.remorque} onValueChange={(value) => setFormData({ ...formData, remorque: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REM001">REM001 - IJ789KL</SelectItem>
                  <SelectItem value="REM002">REM002 - MN012OP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nomClient">Nom du client</Label>
              <Input
                id="nomClient"
                value={formData.nomClient}
                onChange={(e) => setFormData({ ...formData, nomClient: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer la sortie
        </Button>
      </div>
    </form>
  );
};