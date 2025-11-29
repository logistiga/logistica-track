import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OPERATION_TYPES, CreateOperationData } from "@/types/operations";
import { useEffect } from "react";

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
  clients,
}: OperationFormFieldsProps) {
  
  // Calculer automatiquement la durée et le montant pour les locations
  useEffect(() => {
    if (formData.typeOperation === "location" && formData.dateDebut && formData.dateFin && formData.tarifJournalier) {
      const debut = new Date(formData.dateDebut);
      const fin = new Date(formData.dateFin);
      const dureeJours = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dureeJours > 0) {
        const montantCalcule = dureeJours * parseInt(formData.tarifJournalier.toString());
        onFormDataChange({
          ...formData,
          montant: montantCalcule
        });
      }
    }
  }, [formData.dateDebut, formData.dateFin, formData.tarifJournalier, formData.typeOperation]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="typeOperation">Type d'opération *</Label>
        <Select
          value={formData.typeOperation}
          onValueChange={(value: any) => onFormDataChange({ ...formData, typeOperation: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
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

      {/* Dates - Différent selon le type */}
      {formData.typeOperation === "location" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateDebut">Date de début *</Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => onFormDataChange({ ...formData, dateDebut: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateFin">Date de fin *</Label>
              <Input
                id="dateFin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => onFormDataChange({ ...formData, dateFin: e.target.value })}
                required
              />
            </div>
          </div>
          
          {formData.dateDebut && formData.dateFin && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">
                Durée: {Math.ceil((new Date(formData.dateFin).getTime() - new Date(formData.dateDebut).getTime()) / (1000 * 60 * 60 * 24))} jour(s)
              </p>
            </div>
          )}
        </>
      ) : (
        <div>
          <Label htmlFor="dateDebut">Date d'exécution *</Label>
          <Input
            id="dateDebut"
            type="date"
            value={formData.dateDebut}
            onChange={(e) => onFormDataChange({ ...formData, dateDebut: e.target.value })}
            required
          />
        </div>
      )}

      {/* Champs spécifiques Transport */}
      {formData.typeOperation === "transport" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lieuDepart">Lieu de départ *</Label>
            <Input
              id="lieuDepart"
              value={formData.lieuDepart || ""}
              onChange={(e) => onFormDataChange({ ...formData, lieuDepart: e.target.value })}
              placeholder="Ex: PORT"
              required
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={formData.destination || ""}
              onChange={(e) => onFormDataChange({ ...formData, destination: e.target.value })}
              placeholder="Ex: BASE LOGISTIGA"
              required
            />
          </div>
        </div>
      )}

      {/* Véhicules */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="camion">Camion *</Label>
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
          <Label htmlFor="remorque">Remorque *</Label>
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
      </div>

      {/* Client */}
      <div>
        <Label htmlFor="client">Client *</Label>
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

      {/* Tarification */}
      {formData.typeOperation === "location" ? (
        <>
          <div>
            <Label htmlFor="tarifJournalier">Tarif journalier (FCFA) *</Label>
            <Input
              id="tarifJournalier"
              type="number"
              value={formData.tarifJournalier || ""}
              onChange={(e) => onFormDataChange({ ...formData, tarifJournalier: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 7000"
              required
            />
          </div>
          
          {formData.montant > 0 && (
            <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                Montant total calculé: {new Intl.NumberFormat('fr-FR').format(formData.montant)} FCFA
              </p>
            </div>
          )}
        </>
      ) : (
        <div>
          <Label htmlFor="montant">Montant (FCFA) *</Label>
          <Input
            id="montant"
            type="number"
            value={formData.montant || ""}
            onChange={(e) => onFormDataChange({ ...formData, montant: parseInt(e.target.value) || 0 })}
            placeholder="Ex: 50000"
            required
          />
        </div>
      )}

      {/* Instructions */}
      <div>
        <Label htmlFor="instructions">Instructions / Observations</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => onFormDataChange({ ...formData, instructions: e.target.value })}
          placeholder="Détails supplémentaires..."
          rows={3}
        />
      </div>
    </div>
  );
}
