import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface StockageFormData {
  nomClient: string;
  numeroConteneur: string;
  provenance: string;
  dateArrivee: string;
  camionProprietaire: boolean;
  plaqueCamion: string;
  plaqueRemorque: string;
  joursGratuits: number;
  prixParJour: number;
}

interface StockageFormProps {
  onSubmit: (data: StockageFormData) => void;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function StockageForm({ onSubmit, camionsParc = [], remorquesParc = [] }: StockageFormProps) {
  const [formData, setFormData] = useState<StockageFormData>({
    nomClient: "",
    numeroConteneur: "",
    provenance: "",
    dateArrivee: new Date().toISOString().split('T')[0],
    camionProprietaire: true,
    plaqueCamion: "",
    plaqueRemorque: "",
    joursGratuits: 0,
    prixParJour: 0
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
        <Label htmlFor="provenance">Provenance *</Label>
        <Input
          id="provenance"
          value={formData.provenance}
          onChange={(e) => setFormData({ ...formData, provenance: e.target.value })}
          placeholder="Ex: Port de Douala"
          required
        />
      </div>

      <div>
        <Label htmlFor="dateArrivee">Date d'Arrivée *</Label>
        <Input
          id="dateArrivee"
          type="date"
          value={formData.dateArrivee}
          onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
          required
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium">Camion ayant amené le conteneur</h4>
        
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
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent>
                  {camionsParc.map((camion) => (
                    <SelectItem key={camion.id} value={camion.numeroParc}>
                      {camion.numeroParc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorqueParc">Plaque de la remorque</Label>
              <Select value={formData.plaqueRemorque} onValueChange={(value) => setFormData({ ...formData, plaqueRemorque: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent>
                  {remorquesParc.map((remorque) => (
                    <SelectItem key={remorque.id} value={remorque.numeroParc}>
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

      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium">Informations tarifaires</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="joursGratuits">Jours gratuits</Label>
            <Input
              id="joursGratuits"
              type="number"
              value={formData.joursGratuits}
              onChange={(e) => setFormData({ ...formData, joursGratuits: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 5"
            />
          </div>
          <div>
            <Label htmlFor="prixParJour">Prix par jour après franchise (FCFA)</Label>
            <Input
              id="prixParJour"
              type="number"
              value={formData.prixParJour}
              onChange={(e) => setFormData({ ...formData, prixParJour: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 10000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer le Conteneur
        </Button>
      </div>
    </form>
  );
}