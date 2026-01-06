import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehiculeParc } from "@/utils/baseUtils";

interface VehicleSelectorData {
  proprietaire: boolean;
  plaqueCamion: string;
  plaqueRemorque: string;
}

interface VehicleSelectorProps {
  title?: string;
  data: VehicleSelectorData;
  onChange: (data: VehicleSelectorData) => void;
  camionsParc: VehiculeParc[];
  remorquesParc: VehiculeParc[];
  showTitle?: boolean;
}

export function VehicleSelector({ 
  title = "Camion",
  data, 
  onChange, 
  camionsParc, 
  remorquesParc,
  showTitle = true
}: VehicleSelectorProps) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      {showTitle && <h4 className="font-medium">{title}</h4>}
      
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={data.proprietaire}
          onCheckedChange={(checked) => onChange({ ...data, proprietaire: checked as boolean })}
        />
        <Label>Camion appartenant à notre parc ?</Label>
      </div>

      {data.proprietaire ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Plaque du camion</Label>
            <Select 
              value={data.plaqueCamion} 
              onValueChange={(value) => onChange({ ...data, plaqueCamion: value })}
            >
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
            <Select 
              value={data.plaqueRemorque} 
              onValueChange={(value) => onChange({ ...data, plaqueRemorque: value })}
            >
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
              value={data.plaqueCamion}
              onChange={(e) => onChange({ ...data, plaqueCamion: e.target.value })}
              placeholder="Ex: CE 123 AB"
            />
          </div>
          <div>
            <Label>Plaque de la remorque</Label>
            <Input
              value={data.plaqueRemorque}
              onChange={(e) => onChange({ ...data, plaqueRemorque: e.target.value })}
              placeholder="Ex: CE 456 CD"
            />
          </div>
        </div>
      )}
    </div>
  );
}
