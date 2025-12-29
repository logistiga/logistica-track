import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, DollarSign, AlertCircle } from "lucide-react";
import type { PrimeChauffeur } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";
import { PrimePaymentDialog } from "./PrimePaymentDialog";
import { useToast } from "@/hooks/use-toast";

interface PrimeTableProps {
  primes: PrimeChauffeur[];
  onEdit: (prime: PrimeChauffeur) => void;
  onPaySelected: (sortieIds: number[]) => Promise<void>;
}

export function PrimeTable({ primes, onEdit, onPaySelected }: PrimeTableProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrimes, setSelectedPrimes] = useState<number[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const filteredPrimes = primes.filter((prime) =>
    prime.numero_tc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prime.immatriculation && prime.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (prime.chauffeur && prime.chauffeur.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Vérifier si tous les primes sélectionnées ont le même numéro de parc
  const getSelectedPrimesData = () => {
    return primes.filter(p => selectedPrimes.includes(p.id));
  };

  const validateSameParc = (): boolean => {
    const selectedData = getSelectedPrimesData();
    if (selectedData.length <= 1) return true;
    
    const firstParc = selectedData[0].immatriculation;
    return selectedData.every(p => p.immatriculation === firstParc);
  };

  const togglePrime = (primeId: number) => {
    const newSelection = selectedPrimes.includes(primeId)
      ? selectedPrimes.filter(id => id !== primeId)
      : [...selectedPrimes, primeId];
    
    setSelectedPrimes(newSelection);
  };

  const toggleAll = () => {
    if (selectedPrimes.length === filteredPrimes.length) {
      setSelectedPrimes([]);
    } else {
      setSelectedPrimes(filteredPrimes.map(p => p.id));
    }
  };

  const handleOpenPaymentDialog = () => {
    if (!validateSameParc()) {
      toast({
        title: "Sélection invalide",
        description: "Vous ne pouvez payer que des primes du même numéro de parc (immatriculation)",
        variant: "destructive"
      });
      return;
    }
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    await onPaySelected(selectedPrimes);
    setSelectedPrimes([]);
  };

  const selectedTotal = primes
    .filter(p => selectedPrimes.includes(p.id))
    .reduce((sum, p) => sum + (p.prime_chauffeur || 0), 0);

  const isSameParcValid = validateSameParc();

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En attente</Badge>;
      case 'paye':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Payé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Liste des primes - Sélection pour paiement</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {selectedPrimes.length > 0 && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {!isSameParcValid && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Parcs différents</span>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {selectedPrimes.length} sélectionnée(s) - {formatCurrency(selectedTotal)}
                  </span>
                  <Button 
                    onClick={handleOpenPaymentDialog} 
                    size="sm"
                    disabled={!isSameParcValid}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Payer la sélection
                  </Button>
                </div>
              )}
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPrimes.length === filteredPrimes.length && filteredPrimes.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>N° Conteneur</TableHead>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Date Sortie</TableHead>
                  <TableHead>Date Retour</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Aucune prime trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrimes.map((prime) => {
                    const isSelected = selectedPrimes.includes(prime.id);
                    const selectedData = getSelectedPrimesData();
                    const firstSelectedParc = selectedData.length > 0 ? selectedData[0].immatriculation : null;
                    const wouldBreakParc = firstSelectedParc && prime.immatriculation !== firstSelectedParc && !isSelected;
                    
                    return (
                      <TableRow 
                        key={prime.id}
                        className={isSelected ? "bg-primary/5" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => togglePrime(prime.id)}
                            disabled={wouldBreakParc}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{prime.numero_tc}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prime.immatriculation || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>{prime.chauffeur || 'N/A'}</TableCell>
                        <TableCell>{new Date(prime.date_sortie).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          {prime.date_retour 
                            ? new Date(prime.date_retour).toLocaleDateString('fr-FR')
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatCurrency(prime.prime_chauffeur)}
                        </TableCell>
                        <TableCell>{getStatusBadge(prime.statut_prime)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(prime)}
                            disabled={prime.statut_prime === 'paye'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PrimePaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        selectedPrimes={getSelectedPrimesData()}
        onConfirmPayment={handleConfirmPayment}
      />
    </>
  );
}
