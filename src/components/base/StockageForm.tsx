import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StockageFormData {
  numeroConteneur: string;
  dateEntree: string;
  position: string;
  statut: "stocke" | "en_cours" | "sorti";
  clientOrigine: string;
}

interface StockageFormProps {
  onSubmit: (data: StockageFormData) => void;
}

export function StockageForm({ onSubmit }: StockageFormProps) {
  const [formData, setFormData] = useState<StockageFormData>({
    numeroConteneur: "",
    dateEntree: new Date().toISOString().split('T')[0],
    position: "",
    statut: "stocke",
    clientOrigine: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="numeroConteneur">Numéro de Conteneur *</Label>
        <Input
          id="numeroConteneur"
          value={formData.numeroConteneur}
          onChange={(e) => setFormData({ ...formData, numeroConteneur: e.target.value })}
          placeholder="Ex: MSKU1234567"
          required
        />
      </div>

      <div>
        <Label htmlFor="dateEntree">Date d'Entrée *</Label>
        <Input
          id="dateEntree"
          type="date"
          value={formData.dateEntree}
          onChange={(e) => setFormData({ ...formData, dateEntree: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="position">Position de Stockage *</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Ex: A1-15"
          required
        />
      </div>

      <div>
        <Label htmlFor="clientOrigine">Client d'Origine *</Label>
        <Input
          id="clientOrigine"
          value={formData.clientOrigine}
          onChange={(e) => setFormData({ ...formData, clientOrigine: e.target.value })}
          placeholder="Ex: Client ABC"
          required
        />
      </div>

      <div>
        <Label htmlFor="statut">Statut</Label>
        <Select value={formData.statut} onValueChange={(value: any) => setFormData({ ...formData, statut: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stocke">Stocké</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="sorti">Sorti</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit">
          Ajouter
        </Button>
      </div>
    </form>
  );
}