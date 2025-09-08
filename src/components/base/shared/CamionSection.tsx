import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CamionData {
  proprietaire: boolean;
  plaque: string;
  plaqueRemorque: string;
}

interface CamionSectionProps {
  title: string;
  camionData: CamionData;
  onUpdate: (data: CamionData) => void;
  camionsParc?: Array<{id: string, numeroParc: string}>;
  remorquesParc?: Array<{id: string, numeroParc: string}>;
}

export function CamionSection({ 
  title, 
  camionData, 
  onUpdate,
  camionsParc = [],
  remorquesParc = []
}: CamionSectionProps) {
  return (
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
            <Label>Plaque de la remorque</Label>
            <Select value={camionData.plaqueRemorque} onValueChange={(value) => onUpdate({ ...camionData, plaqueRemorque: value })}>
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
}