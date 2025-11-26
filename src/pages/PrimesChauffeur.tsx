import { useState } from "react";
import { PrimeStats } from "@/components/primes/PrimeStats";
import { PrimeTable } from "@/components/primes/PrimeTable";
import { PrimeDialog } from "@/components/primes/PrimeDialog";
import { usePrimes } from "@/hooks/usePrimes";
import type { PrimeChauffeur } from "@/types/prime";

export default function PrimesChauffeur() {
  const { primes, stats, loading, updatePrime, marquerCommePaye } = usePrimes();
  const [selectedPrime, setSelectedPrime] = useState<PrimeChauffeur | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (prime: PrimeChauffeur) => {
    setSelectedPrime(prime);
    setDialogOpen(true);
  };

  const handleMarkAsPaid = async (prime: PrimeChauffeur) => {
    if (confirm(`Confirmer le paiement de la prime de ${prime.montant_prime} FCFA pour le conteneur ${prime.numero_conteneur} ?`)) {
      await marquerCommePaye(prime.sortie_id);
    }
  };

  const handleSubmitEdit = async (primeId: number, montant: number, observations: string) => {
    await updatePrime(primeId, {
      montant_prime: montant,
      observations
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Primes Chauffeur</h1>
        <p className="text-muted-foreground">
          Gestion des primes de chauffeur pour les sorties de conteneur
        </p>
      </div>

      <PrimeStats stats={stats} />

      <PrimeTable
        primes={primes}
        onEdit={handleEdit}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <PrimeDialog
        prime={selectedPrime}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitEdit}
      />
    </div>
  );
}
