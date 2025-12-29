import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, Truck, FileText, Check } from "lucide-react";
import type { PrimeChauffeur } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";
import { PrimePaymentDialog } from "./PrimePaymentDialog";

interface PrimePaymentTabProps {
  primes: PrimeChauffeur[];
  onPaySelected: (sortieIds: number[]) => Promise<void>;
}

interface VehicleGroup {
  immatriculation: string;
  primes: PrimeChauffeur[];
  totalMontant: number;
  nombreConteneurs: number;
}

export function PrimePaymentTab({ primes, onPaySelected }: PrimePaymentTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedPrimes, setSelectedPrimes] = useState<number[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Grouper les primes par véhicule (immatriculation)
  const vehicleGroups = useMemo(() => {
    const groups: Record<string, VehicleGroup> = {};
    
    primes.forEach((prime) => {
      const immat = prime.immatriculation || 'N/A';
      if (!groups[immat]) {
        groups[immat] = {
          immatriculation: immat,
          primes: [],
          totalMontant: 0,
          nombreConteneurs: 0
        };
      }
      groups[immat].primes.push(prime);
      groups[immat].totalMontant += prime.prime_chauffeur || 0;
      groups[immat].nombreConteneurs += 1;
    });

    return Object.values(groups).filter(group => 
      group.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.primes.some(p => p.numero_tc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [primes, searchTerm]);

  const handleSelectVehicle = (immat: string) => {
    if (selectedVehicle === immat) {
      setSelectedVehicle(null);
      setSelectedPrimes([]);
    } else {
      setSelectedVehicle(immat);
      const group = vehicleGroups.find(g => g.immatriculation === immat);
      if (group) {
        setSelectedPrimes(group.primes.map(p => p.id));
      }
    }
  };

  const togglePrimeInSelection = (primeId: number) => {
    setSelectedPrimes(prev => 
      prev.includes(primeId)
        ? prev.filter(id => id !== primeId)
        : [...prev, primeId]
    );
  };

  const getSelectedPrimesData = () => {
    return primes.filter(p => selectedPrimes.includes(p.id));
  };

  const selectedTotal = getSelectedPrimesData().reduce((sum, p) => sum + (p.prime_chauffeur || 0), 0);

  const handleConfirmPayment = async () => {
    await onPaySelected(selectedPrimes);
    setSelectedPrimes([]);
    setSelectedVehicle(null);
  };

  const selectedGroup = selectedVehicle 
    ? vehicleGroups.find(g => g.immatriculation === selectedVehicle)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Liste des véhicules */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Véhicules
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
          {vehicleGroups.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucun véhicule trouvé</p>
          ) : (
            vehicleGroups.map((group) => (
              <div
                key={group.immatriculation}
                onClick={() => handleSelectVehicle(group.immatriculation)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedVehicle === group.immatriculation 
                    ? "bg-primary/10 border-primary" 
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">{group.immatriculation}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {group.nombreConteneurs} conteneur(s)
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatCurrency(group.totalMontant)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Détails du véhicule sélectionné */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              {selectedGroup 
                ? `Primes - ${selectedGroup.immatriculation}`
                : "Sélectionnez un véhicule"
              }
            </CardTitle>
            {selectedPrimes.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {selectedPrimes.length} sélectionnée(s) - {formatCurrency(selectedTotal)}
                </span>
                <Button onClick={() => setPaymentDialogOpen(true)} size="sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Payer
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!selectedGroup ? (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un véhicule pour voir les primes à payer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedPrimes.length === selectedGroup.primes.length}
                        onCheckedChange={() => {
                          if (selectedPrimes.length === selectedGroup.primes.length) {
                            setSelectedPrimes([]);
                          } else {
                            setSelectedPrimes(selectedGroup.primes.map(p => p.id));
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>N° Conteneur</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date Sortie</TableHead>
                    <TableHead>Date Retour</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedGroup.primes.map((prime) => (
                    <TableRow 
                      key={prime.id}
                      className={selectedPrimes.includes(prime.id) ? "bg-primary/5" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedPrimes.includes(prime.id)}
                          onCheckedChange={() => togglePrimeInSelection(prime.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{prime.numero_tc}</TableCell>
                      <TableCell>{prime.nom_client || 'N/A'}</TableCell>
                      <TableCell>{new Date(prime.date_sortie).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        {prime.date_retour 
                          ? new Date(prime.date_retour).toLocaleDateString('fr-FR')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(prime.prime_chauffeur)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <PrimePaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        selectedPrimes={getSelectedPrimesData()}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}