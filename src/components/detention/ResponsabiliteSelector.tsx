import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResponsabiliteSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ResponsabiliteSelector({ value, onChange }: ResponsabiliteSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="responsabilite">Responsabilité</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner la responsabilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client">Client</SelectItem>
          <SelectItem value="logistica">Société Logistica</SelectItem>
          <SelectItem value="partagee">Partagée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}