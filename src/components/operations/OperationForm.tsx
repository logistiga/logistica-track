import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateOperationData, OPERATION_TYPES } from "@/types/operations";

interface OperationFormProps {
  onSubmit: (data: CreateOperationData) => void;
  camions: Array<{ id: string; numero: string; marque: string; modele: string }>;
  remorques: Array<{ id: string; numero: string; type: string }>;
  clients: string[];
}

export function OperationForm({ onSubmit, camions, remorques, clients }: OperationFormProps) {
  const [formData, setFormData] = useState<CreateOperationData>({
    typeOperation: "location",
    dateExecution: "",
    camion: "",
    remorque: "",
    client: "",
    instructions: "",
    montant: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      typeOperation: "location",
      dateExecution: "",
      camion: "",
      remorque: "",
      client: "",
      instructions: "",
      montant: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle opération</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="typeOperation">Type d'opération</Label>
              <Select 
                value={formData.typeOperation} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, typeOperation: value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, dateExecution: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="camion">Camion</Label>
              <Select 
                value={formData.camion} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, camion: value }))}
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, remorque: value }))}
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
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
              <Label htmlFor="montant">Montant (€)</Label>
              <Input
                id="montant"
                type="number"
                min="0"
                step="0.01"
                value={formData.montant}
                onChange={(e) => setFormData(prev => ({ ...prev, montant: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Instructions / Description</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Détails de l'opération..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Créer l'opération
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}