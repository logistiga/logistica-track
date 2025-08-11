import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateOperationData, OPERATION_TYPES } from "@/types/operations";

interface OperationFormFieldsProps {
  formData: CreateOperationData;
  onFormDataChange: (data: CreateOperationData) => void;
  camions: Array<{ id: string; numero: string; marque: string; modele: string }>;
  remorques: Array<{ id: string; numero: string; type: string }>;
  clients: string[];
}

export function OperationFormFields({ 
  formData, 
  onFormDataChange, 
  camions, 
  remorques, 
  clients 
}: OperationFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="typeOperation">Type d'opération</Label>
          <Select 
            value={formData.typeOperation} 
            onValueChange={(value: any) => onFormDataChange({ ...formData, typeOperation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {OPERATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dateExecution">Date d'exécution</Label>
          <Input
            id="dateExecution"
            type="date"
            value={formData.dateExecution}
            onChange={(e) => onFormDataChange({ ...formData, dateExecution: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="camion">Camion</Label>
          <Select 
            value={formData.camion} 
            onValueChange={(value) => onFormDataChange({ ...formData, camion: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un camion" />
            </SelectTrigger>
            <SelectContent>
              {camions.map((camion) => (
                <SelectItem key={camion.id} value={`${camion.numero} - ${camion.marque} ${camion.modele}`}>
                  {camion.numero} - {camion.marque} {camion.modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="remorque">Remorque</Label>
          <Select 
            value={formData.remorque} 
            onValueChange={(value) => onFormDataChange({ ...formData, remorque: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une remorque" />
            </SelectTrigger>
            <SelectContent>
              {remorques.map((remorque) => (
                <SelectItem key={remorque.id} value={`${remorque.numero} - ${remorque.type}`}>
                  {remorque.numero} - {remorque.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="client">Client</Label>
          <Select 
            value={formData.client} 
            onValueChange={(value) => onFormDataChange({ ...formData, client: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="montant">Montant (FCFA)</Label>
          <Input
            id="montant"
            type="number"
            min="0"
            step="0.01"
            value={formData.montant}
            onChange={(e) => onFormDataChange({ ...formData, montant: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="instructions">Instructions / Description</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => onFormDataChange({ ...formData, instructions: e.target.value })}
          placeholder="Détails de l'opération..."
          rows={3}
        />
      </div>
    </>
  );
}