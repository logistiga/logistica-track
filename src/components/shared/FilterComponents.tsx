import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

interface DateRangeFilterProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (date: string) => void;
  onDateFinChange: (date: string) => void;
}

interface ExportButtonsProps {
  onExport: (format: string) => void;
  formats: readonly { value: string; label: string }[];
}

interface ResetButtonProps {
  onReset: () => void;
}

export function DateRangeFilter({ dateDebut, dateFin, onDateDebutChange, onDateFinChange }: DateRangeFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="dateDebut">Date début</Label>
        <Input
          id="dateDebut"
          type="date"
          value={dateDebut}
          onChange={(e) => onDateDebutChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="dateFin">Date fin</Label>
        <Input
          id="dateFin"
          type="date"
          value={dateFin}
          onChange={(e) => onDateFinChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function ExportButtons({ onExport, formats }: ExportButtonsProps) {
  return (
    <div className="border-t pt-4">
      <Label>Exporter les données</Label>
      <div className="flex gap-2 mt-2">
        {formats.map((format) => (
          <Button
            key={format.value}
            onClick={() => onExport(format.value)}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-1" />
            {format.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onReset} variant="outline" className="flex-1">
        Réinitialiser
      </Button>
    </div>
  );
}