import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PrimeChauffeur } from "@/types/prime";

interface PrimeDialogProps {
  prime: PrimeChauffeur | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (primeId: number, montant: number, observations: string) => void;
}

export function PrimeDialog({ prime, open, onOpenChange, onSubmit }: PrimeDialogProps) {
  const [montant, setMontant] = useState<string>("");
  const [observations, setObservations] = useState<string>("");

  useEffect(() => {
    if (prime) {
      setMontant(prime.montant_prime.toString());
      setObservations(prime.observations || "");
    }
  }, [prime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prime && montant) {
      onSubmit(prime.sortie_id, parseFloat(montant), observations);
      onOpenChange(false);
    }
  };

  if (!prime) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la prime chauffeur</DialogTitle>
          <DialogDescription>
            Conteneur: {prime.numero_conteneur} - Camion: {prime.camion}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="montant">Montant de la prime (FCFA) *</Label>
            <Input
              id="montant"
              type="number"
              min="0"
              step="500"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="Ex: 25000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Remarques ou notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
