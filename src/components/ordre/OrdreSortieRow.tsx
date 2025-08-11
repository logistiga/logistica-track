import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { OrdreSortieStandard } from "@/types/ordre";

interface EditableCellProps {
  isEditing: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

function EditableCell({ isEditing, value, placeholder, onChange, className }: EditableCellProps) {
  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  return <span>{value || "Non défini"}</span>;
}

interface TableRowActionsProps {
  sortie: OrdreSortieStandard;
  isEditing: boolean;
  isComplete: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onConfirm: () => void;
}

export function TableRowActions({
  sortie,
  isEditing,
  isComplete,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onConfirm
}: TableRowActionsProps) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave}>OK</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Annuler</Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
      {isComplete && (
        <Button variant="outline" size="sm" onClick={onConfirm}>
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

interface OrdreSortieRowProps {
  sortie: OrdreSortieStandard;
  editingId: string | null;
  formData: any;
  onFormDataChange: (data: any) => void;
  onEdit: (sortie: OrdreSortieStandard) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (sortie: OrdreSortieStandard) => void;
  onConfirm: (sortie: OrdreSortieStandard) => void;
}

export function OrdreSortieRow({
  sortie,
  editingId,
  formData,
  onFormDataChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onConfirm
}: OrdreSortieRowProps) {
  const isEditing = editingId === sortie.id;
  const isComplete = sortie.pvSortie && sortie.pvRentreePort && sortie.numeroOrdre;

  return (
    <TableRow key={sortie.id}>
      <TableCell className="font-medium">{sortie.numeroConteneur}</TableCell>
      <TableCell>{sortie.typeConteneur}</TableCell>
      <TableCell>{sortie.codeArmateur}</TableCell>
      <TableCell>{sortie.nomClient}</TableCell>
      <TableCell>{sortie.destination}</TableCell>
      <TableCell>
        <EditableCell
          isEditing={isEditing}
          value={isEditing ? formData.pvSortie : sortie.pvSortie || ""}
          placeholder="PV Sortie"
          onChange={(value) => onFormDataChange({ ...formData, pvSortie: value })}
          className="w-24"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          isEditing={isEditing}
          value={isEditing ? formData.pvRentreePort : sortie.pvRentreePort || ""}
          placeholder="PV Rentrée"
          onChange={(value) => onFormDataChange({ ...formData, pvRentreePort: value })}
          className="w-24"
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={formData.numeroOrdre}
              onChange={(e) => onFormDataChange({ ...formData, numeroOrdre: e.target.value })}
              placeholder="N° Ordre"
              className="w-24"
            />
            <Button size="sm" onClick={() => onSave(sortie.id)}>OK</Button>
            <Button size="sm" variant="outline" onClick={onCancel}>Annuler</Button>
          </div>
        ) : (
          sortie.numeroOrdre || "Non défini"
        )}
      </TableCell>
      <TableCell>
        <TableRowActions
          sortie={sortie}
          isEditing={isEditing}
          isComplete={!!isComplete}
          onEdit={() => onEdit(sortie)}
          onSave={() => onSave(sortie.id)}
          onCancel={onCancel}
          onDelete={() => onDelete(sortie)}
          onConfirm={() => onConfirm(sortie)}
        />
      </TableCell>
    </TableRow>
  );
}