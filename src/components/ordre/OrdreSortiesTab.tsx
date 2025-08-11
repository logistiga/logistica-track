import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdreSortieStandard, UpdateOrdreSortieData } from "@/types/ordre";
import { OrdreSortieRow } from "./OrdreSortieRow";

interface OrdreSortiesTabProps {
  sorties: OrdreSortieStandard[];
  onUpdate: (data: UpdateOrdreSortieData) => void;
  onDelete: (sortie: OrdreSortieStandard) => void;
  onConfirm: (sortie: OrdreSortieStandard) => void;
}

export function OrdreSortiesTab({ 
  sorties, 
  onUpdate, 
  onDelete, 
  onConfirm 
}: OrdreSortiesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pvSortie: "",
    pvRentreePort: "",
    numeroOrdre: ""
  });

  const handleEdit = (sortie: OrdreSortieStandard) => {
    setEditingId(sortie.id);
    setFormData({
      pvSortie: sortie.pvSortie || "",
      pvRentreePort: sortie.pvRentreePort || "",
      numeroOrdre: sortie.numeroOrdre || ""
    });
  };

  const handleSave = (id: string) => {
    if (formData.pvSortie.trim() && formData.pvRentreePort.trim() && formData.numeroOrdre.trim()) {
      onUpdate({
        id,
        pvSortie: formData.pvSortie.trim(),
        pvRentreePort: formData.pvRentreePort.trim(),
        numeroOrdre: formData.numeroOrdre.trim()
      });
      setEditingId(null);
      setFormData({ pvSortie: "", pvRentreePort: "", numeroOrdre: "" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ pvSortie: "", pvRentreePort: "", numeroOrdre: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sorties standards en attente de validation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conteneur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Armateur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>PV Sortie</TableHead>
              <TableHead>PV Rentrée</TableHead>
              <TableHead>N° Ordre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorties.map((sortie) => (
              <OrdreSortieRow
                key={sortie.id}
                sortie={sortie}
                editingId={editingId}
                formData={formData}
                onFormDataChange={setFormData}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={onDelete}
                onConfirm={onConfirm}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}