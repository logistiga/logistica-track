import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, DollarSign } from "lucide-react";
import type { PrimeChauffeur } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";

interface PrimeTableProps {
  primes: PrimeChauffeur[];
  onEdit: (prime: PrimeChauffeur) => void;
  onPaySelected: (sortieIds: number[]) => void;
}

export function PrimeTable({ primes, onEdit, onPaySelected }: PrimeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrimes, setSelectedPrimes] = useState<number[]>([]);

  const filteredPrimes = primes.filter((prime) =>
    prime.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prime.camion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prime.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prime.chauffeur && prime.chauffeur.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const togglePrime = (sortieId: number) => {
    setSelectedPrimes(prev =>
      prev.includes(sortieId)
        ? prev.filter(id => id !== sortieId)
        : [...prev, sortieId]
    );
  };

  const toggleAll = () => {
    if (selectedPrimes.length === filteredPrimes.length) {
      setSelectedPrimes([]);
    } else {
      setSelectedPrimes(filteredPrimes.map(p => p.sortie_id));
    }
  };

  const handlePaySelected = () => {
    onPaySelected(selectedPrimes);
    setSelectedPrimes([]);
  };

  const selectedTotal = primes
    .filter(p => selectedPrimes.includes(p.sortie_id))
    .reduce((sum, p) => sum + p.montant_prime, 0);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'retourne':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Retourné</Badge>;
      case 'paye':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Payé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des primes - Sélection pour paiement</CardTitle>
          <div className="flex items-center gap-4">
            {selectedPrimes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedPrimes.length} sélectionnée(s) - Total: {formatCurrency(selectedTotal)}
                </span>
                <Button onClick={handlePaySelected} size="sm">
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
              <TableHead>Camion</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Client</TableHead>
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
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  Aucune prime trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredPrimes.map((prime) => (
                <TableRow key={prime.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPrimes.includes(prime.sortie_id)}
                      onCheckedChange={() => togglePrime(prime.sortie_id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{prime.numero_conteneur}</TableCell>
                  <TableCell>{prime.camion}</TableCell>
                  <TableCell>{prime.chauffeur || 'N/A'}</TableCell>
                  <TableCell>{prime.nom_client}</TableCell>
                  <TableCell>{new Date(prime.date_sortie).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    {prime.date_retour 
                      ? new Date(prime.date_retour).toLocaleDateString('fr-FR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatCurrency(prime.montant_prime)}
                  </TableCell>
                  <TableCell>{getStatusBadge(prime.statut)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(prime)}
                      disabled={prime.statut === 'paye'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
