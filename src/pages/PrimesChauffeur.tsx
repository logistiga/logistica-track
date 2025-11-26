import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrimeStats } from "@/components/primes/PrimeStats";
import { PrimeTable } from "@/components/primes/PrimeTable";
import { PrimeArchiveTable } from "@/components/primes/PrimeArchiveTable";
import { PrimeDialog } from "@/components/primes/PrimeDialog";
import { usePrimes } from "@/hooks/usePrimes";
import type { PrimeChauffeur } from "@/types/prime";

export default function PrimesChauffeur() {
  const { primes, archives, stats, archiveStats, updatePrime, payerEnLot } = usePrimes();
  const [selectedPrime, setSelectedPrime] = useState<PrimeChauffeur | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (prime: PrimeChauffeur) => {
    setSelectedPrime(prime);
    setDialogOpen(true);
  };

  const handlePaySelected = async (sortieIds: number[]) => {
    if (sortieIds.length === 0) {
      return;
    }
    
    if (confirm(`Confirmer le paiement de ${sortieIds.length} prime(s) sélectionnée(s) ?`)) {
      await payerEnLot(sortieIds);
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
          Gestion des primes de chauffeur - Paiement par semaine
        </p>
      </div>

      <PrimeStats stats={stats} />

      <Tabs defaultValue="en-cours" className="space-y-6">
        <TabsList>
          <TabsTrigger value="en-cours">Primes en attente</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="en-cours" className="space-y-4">
          <PrimeTable
            primes={primes}
            onEdit={handleEdit}
            onPaySelected={handlePaySelected}
          />
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <PrimeArchiveTable
            archives={archives}
            stats={archiveStats}
          />
        </TabsContent>
      </Tabs>

      <PrimeDialog
        prime={selectedPrime}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitEdit}
      />
    </div>
  );
}
