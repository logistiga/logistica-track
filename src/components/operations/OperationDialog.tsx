import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateOperationData } from "@/types/operations";
import { OperationFormFields } from "./OperationFormFields";

interface OperationDialogProps {
  onSubmit: (data: CreateOperationData) => void;
  camions: Array<{ id: string; numero: string; marque: string; modele: string }>;
  remorques: Array<{ id: string; numero: string; type: string }>;
  clients: string[];
}

export function OperationDialog({ onSubmit, camions, remorques, clients }: OperationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateOperationData>({
    typeOperation: "location",
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: "",
    camion: "",
    remorque: "",
    client: "",
    tarifJournalier: 0,
    montant: 0,
    lieuDepart: "",
    destination: "",
    instructions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      typeOperation: "location",
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: "",
      camion: "",
      remorque: "",
      client: "",
      tarifJournalier: 0,
      montant: 0,
      lieuDepart: "",
      destination: "",
      instructions: ""
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle opération
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle opération</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <OperationFormFields
            formData={formData}
            onFormDataChange={setFormData}
            camions={camions}
            remorques={remorques}
            clients={clients}
          />

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'opération
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}