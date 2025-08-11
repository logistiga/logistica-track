import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { OrdreSortieStandard, UpdateOrdreSortieData } from "@/types/ordre";

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

  const isComplete = (sortie: OrdreSortieStandard) => {
    return sortie.pvSortie && sortie.pvRentreePort && sortie.numeroOrdre;
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
              <TableRow key={sortie.id}>
                <TableCell className="font-medium">{sortie.numeroConteneur}</TableCell>
                <TableCell>{sortie.typeConteneur}</TableCell>
                <TableCell>{sortie.codeArmateur}</TableCell>
                <TableCell>{sortie.nomClient}</TableCell>
                <TableCell>{sortie.destination}</TableCell>
                <TableCell>
                  {editingId === sortie.id ? (
                    <Input
                      value={formData.pvSortie}
                      onChange={(e) => setFormData(prev => ({ ...prev, pvSortie: e.target.value }))}
                      placeholder="PV Sortie"
                      className="w-24"
                    />
                  ) : (
                    sortie.pvSortie || "Non défini"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === sortie.id ? (
                    <Input
                      value={formData.pvRentreePort}
                      onChange={(e) => setFormData(prev => ({ ...prev, pvRentreePort: e.target.value }))}
                      placeholder="PV Rentrée"
                      className="w-24"
                    />
                  ) : (
                    sortie.pvRentreePort || "Non défini"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === sortie.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={formData.numeroOrdre}
                        onChange={(e) => setFormData(prev => ({ ...prev, numeroOrdre: e.target.value }))}
                        placeholder="N° Ordre"
                        className="w-24"
                      />
                      <Button size="sm" onClick={() => handleSave(sortie.id)}>
                        OK
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    sortie.numeroOrdre || "Non défini"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(sortie)}
                      disabled={editingId === sortie.id}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(sortie)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {isComplete(sortie) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirm(sortie)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}