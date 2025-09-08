import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CamionSection } from "./shared/CamionSection";

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
  initialData?: Partial<DoubleRelevageFormData>;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function DoubleRelevageForm({ onSubmit, initialData, camionsParc = [], remorquesParc = [] }: DoubleRelevageFormProps) {
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
    montantOperation: 0,
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
        camionsParc={camionsParc}
        remorquesParc={remorquesParc}
      />

      <CamionSection
        title="Camion qui va récupérer le conteneur"
        camionData={formData.camionRecuperateur}
        onUpdate={(data) => setFormData({ ...formData, camionRecuperateur: data })}
        camionsParc={camionsParc}
        remorquesParc={remorquesParc}
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