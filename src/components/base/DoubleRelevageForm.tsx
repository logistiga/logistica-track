import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface DoubleRelevageFormData {
  nomClient: string;
  numeroConteneur: string;
  provenance: string;
  camionAmeneur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  camionRecuperateur: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
  montantOperation: number;
}

interface DoubleRelevageFormProps {
  onSubmit: (data: DoubleRelevageFormData) => void;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function DoubleRelevageForm({ onSubmit, camionsParc = [], remorquesParc = [] }: DoubleRelevageFormProps) {
  const [formData, setFormData] = useState<DoubleRelevageFormData>({
    nomClient: "",
    numeroConteneur: "",
    provenance: "",
    camionAmeneur: {
      proprietaire: true,
      plaque: "",
      plaqueRemorque: ""
    },
    camionRecuperateur: {
      proprietaire: true,
      plaque: "",
      plaqueRemorque: ""
    },
    montantOperation: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const CamionSection = ({ 
    title, 
    camionData, 
    onUpdate 
  }: { 
    title: string; 
    camionData: typeof formData.camionAmeneur; 
    onUpdate: (data: typeof formData.camionAmeneur) => void;
  }) => (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <h4 className="font-medium">{title}</h4>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={camionData.proprietaire}
          onCheckedChange={(checked) => onUpdate({ ...camionData, proprietaire: checked as boolean })}
        />
        <Label>Camion appartenant à notre parc ?</Label>
      </div>

      {camionData.proprietaire ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Plaque du camion</Label>
            <Select value={camionData.plaque} onValueChange={(value) => onUpdate({ ...camionData, plaque: value })}>
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
            <Label>Plaque de la remorque</Label>
            <Select value={camionData.plaqueRemorque} onValueChange={(value) => onUpdate({ ...camionData, plaqueRemorque: value })}>
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
            <Label>Plaque du camion</Label>
            <Input
              value={camionData.plaque}
              onChange={(e) => onUpdate({ ...camionData, plaque: e.target.value })}
              placeholder="Ex: CE 123 AB"
            />
          </div>
          <div>
            <Label>Plaque de la remorque</Label>
            <Input
              value={camionData.plaqueRemorque}
              onChange={(e) => onUpdate({ ...camionData, plaqueRemorque: e.target.value })}
              placeholder="Ex: CE 456 CD"
            />
          </div>
        </div>
      )}
    </div>
  );

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
          placeholder="Ex: TCLU5678901"
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

      <CamionSection
        title="Camion qui amène le conteneur"
        camionData={formData.camionAmeneur}
        onUpdate={(data) => setFormData({ ...formData, camionAmeneur: data })}
      />

      <CamionSection
        title="Camion qui va récupérer le conteneur"
        camionData={formData.camionRecuperateur}
        onUpdate={(data) => setFormData({ ...formData, camionRecuperateur: data })}
      />

      <div className="bg-muted/50 p-4 rounded-lg">
        <Label htmlFor="montantOperation">Montant de l'opération (FCFA)</Label>
        <Input
          id="montantOperation"
          type="number"
          value={formData.montantOperation}
          onChange={(e) => setFormData({ ...formData, montantOperation: parseInt(e.target.value) || 0 })}
          placeholder="Ex: 50000"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer l'Opération
        </Button>
      </div>
    </form>
  );
}