import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface DepotageFormData {
  nomClient: string;
  numeroConteneur: string;
  dateDepotage: string;
  camionProprietaire: boolean;
  plaqueCamion: string;
  plaqueRemorque: string;
  typeMarchandise: string;
  prixDepotage: number;
  observations?: string;
}

interface DepotageFormProps {
  onSubmit: (data: DepotageFormData) => void;
  initialData?: Partial<DepotageFormData>;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function DepotageForm({ onSubmit, initialData, camionsParc = [], remorquesParc = [] }: DepotageFormProps) {
  const [formData, setFormData] = useState<DepotageFormData>({
    nomClient: initialData?.nomClient || "",
    numeroConteneur: initialData?.numeroConteneur || "",
    dateDepotage: new Date().toISOString().split('T')[0],
    camionProprietaire: true,
    plaqueCamion: "",
    plaqueRemorque: "",
    typeMarchandise: "",
    prixDepotage: 75000, // Prix par défaut
    observations: "",
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nomClient">Nom du Client *</Label>
        <Input
          id="nomClient"
          value={formData.nomClient}
          onChange={(e) => setFormData({ ...formData, nomClient: e.target.value })}
          placeholder="Ex: Client ABC"
          required
        />
      </div>

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
        <Label htmlFor="dateDepotage">Date de Dépotage *</Label>
        <Input
          id="dateDepotage"
          type="date"
          value={formData.dateDepotage}
          onChange={(e) => setFormData({ ...formData, dateDepotage: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="typeMarchandise">Type de Marchandise *</Label>
        <Textarea
          id="typeMarchandise"
          value={formData.typeMarchandise}
          onChange={(e) => setFormData({ ...formData, typeMarchandise: e.target.value })}
          placeholder="Décrire le type de marchandise..."
          required
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium">Camion pour le dépotage</h4>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="camionProprietaire"
            checked={formData.camionProprietaire}
            onCheckedChange={(checked) => setFormData({ ...formData, camionProprietaire: checked as boolean })}
          />
          <Label htmlFor="camionProprietaire">Camion appartenant à notre parc ?</Label>
        </div>

        {formData.camionProprietaire ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camionParc">Plaque du camion</Label>
              <Select value={formData.plaqueCamion} onValueChange={(value) => setFormData({ ...formData, plaqueCamion: value })}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-input z-50">
                  {camionsParc.map((camion) => (
                    <SelectItem key={camion.id} value={camion.numeroParc} className="hover:bg-muted">
                      {camion.numeroParc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorqueParc">Plaque de la remorque</Label>
              <Select value={formData.plaqueRemorque} onValueChange={(value) => setFormData({ ...formData, plaqueRemorque: value })}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-input z-50">
                  {remorquesParc.map((remorque) => (
                    <SelectItem key={remorque.id} value={remorque.numeroParc} className="hover:bg-muted">
                      {remorque.numeroParc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plaqueCamion">Plaque du camion</Label>
              <Input
                id="plaqueCamion"
                value={formData.plaqueCamion}
                onChange={(e) => setFormData({ ...formData, plaqueCamion: e.target.value })}
                placeholder="Ex: CE 123 AB"
              />
            </div>
            <div>
              <Label htmlFor="plaqueRemorque">Plaque de la remorque</Label>
              <Input
                id="plaqueRemorque"
                value={formData.plaqueRemorque}
                onChange={(e) => setFormData({ ...formData, plaqueRemorque: e.target.value })}
                placeholder="Ex: CE 456 CD"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <Label htmlFor="prixDepotage">Prix du Dépotage (FCFA)</Label>
        <Input
          id="prixDepotage"
          type="number"
          value={formData.prixDepotage}
          onChange={(e) => setFormData({ ...formData, prixDepotage: parseInt(e.target.value) || 0 })}
          placeholder="Ex: 75000"
        />
      </div>

      <div>
        <Label htmlFor="observations">Observations</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          placeholder="Notes supplémentaires..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer le Dépotage
        </Button>
      </div>
    </form>
  );
}