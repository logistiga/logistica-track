import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface SortieStockageData {
  dateSortie: string;
  camionSortie: {
    proprietaire: boolean;
    plaque: string;
    plaqueRemorque: string;
  };
}

interface SortieStockageDialogProps {
  onConfirm: (data: SortieStockageData) => void;
  onCancel: () => void;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function SortieStockageDialog({ 
  onConfirm, 
  onCancel, 
  camionsParc = [], 
  remorquesParc = [] 
}: SortieStockageDialogProps) {
  const [formData, setFormData] = useState<SortieStockageData>({
    dateSortie: new Date().toISOString().split('T')[0],
    camionSortie: {
      proprietaire: true,
      plaque: "",
      plaqueRemorque: ""
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="dateSortie">Date de Sortie *</Label>
        <Input
          id="dateSortie"
          type="date"
          value={formData.dateSortie}
          onChange={(e) => setFormData({ ...formData, dateSortie: e.target.value })}
          required
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium">Camion qui fait sortir le conteneur</h4>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.camionSortie.proprietaire}
            onCheckedChange={(checked) => 
              setFormData({ 
                ...formData, 
                camionSortie: { ...formData.camionSortie, proprietaire: checked as boolean }
              })
            }
          />
          <Label>Camion appartenant à notre parc ?</Label>
        </div>

        {formData.camionSortie.proprietaire ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Plaque du camion</Label>
              <Select 
                value={formData.camionSortie.plaque} 
                onValueChange={(value) => 
                  setFormData({ 
                    ...formData, 
                    camionSortie: { ...formData.camionSortie, plaque: value }
                  })
                }
              >
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
              <Select 
                value={formData.camionSortie.plaqueRemorque} 
                onValueChange={(value) => 
                  setFormData({ 
                    ...formData, 
                    camionSortie: { ...formData.camionSortie, plaqueRemorque: value }
                  })
                }
              >
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
                value={formData.camionSortie.plaque}
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    camionSortie: { ...formData.camionSortie, plaque: e.target.value }
                  })
                }
                placeholder="Ex: CE 123 AB"
              />
            </div>
            <div>
              <Label>Plaque de la remorque</Label>
              <Input
                value={formData.camionSortie.plaqueRemorque}
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    camionSortie: { ...formData.camionSortie, plaqueRemorque: e.target.value }
                  })
                }
                placeholder="Ex: CE 456 CD"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Confirmer la Sortie
        </Button>
      </div>
    </form>
  );
}