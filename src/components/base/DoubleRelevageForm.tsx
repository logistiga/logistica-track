import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DoubleRelevageFormData {
  numeroConteneur: string;
  dateOperation: string;
  typeOperation: "entree" | "sortie";
  motif: string;
  statut: "en_attente" | "termine" | "annule";
}

interface DoubleRelevageFormProps {
  onSubmit: (data: DoubleRelevageFormData) => void;
}

export function DoubleRelevageForm({ onSubmit }: DoubleRelevageFormProps) {
  const [formData, setFormData] = useState<DoubleRelevageFormData>({
    numeroConteneur: "",
    dateOperation: new Date().toISOString().split('T')[0],
    typeOperation: "entree",
    motif: "",
    statut: "en_attente"
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
          placeholder="Ex: TCLU5678901"
          required
        />
      </div>

      <div>
        <Label htmlFor="dateOperation">Date d'Opération *</Label>
        <Input
          id="dateOperation"
          type="date"
          value={formData.dateOperation}
          onChange={(e) => setFormData({ ...formData, dateOperation: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="typeOperation">Type d'Opération *</Label>
        <Select value={formData.typeOperation} onValueChange={(value: any) => setFormData({ ...formData, typeOperation: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entree">Entrée</SelectItem>
            <SelectItem value="sortie">Sortie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="motif">Motif de l'Opération *</Label>
        <Textarea
          id="motif"
          value={formData.motif}
          onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          placeholder="Ex: Repositionnement, Réparation..."
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
            <SelectItem value="en_attente">En Attente</SelectItem>
            <SelectItem value="termine">Terminé</SelectItem>
            <SelectItem value="annule">Annulé</SelectItem>
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