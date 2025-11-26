import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, CheckCircle, Search } from "lucide-react";
import type { PrimeChauffeur } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";

interface PrimeTableProps {
  primes: PrimeChauffeur[];
  onEdit: (prime: PrimeChauffeur) => void;
  onMarkAsPaid: (prime: PrimeChauffeur) => void;
}

export function PrimeTable({ primes, onEdit, onMarkAsPaid }: PrimeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrimes = primes.filter(prime => 
    prime.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prime.camion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prime.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prime.chauffeur && prime.chauffeur.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>;
      case "retourne":
        return <Badge variant="default">Retourné</Badge>;
      case "paye":
        return <Badge className="bg-green-500 hover:bg-green-600">Payé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Liste des primes chauffeur</CardTitle>
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
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Conteneur</TableHead>
                <TableHead>Camion</TableHead>
                <TableHead>Chauffeur</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date sortie</TableHead>
                <TableHead>Date retour</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrimes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Aucune prime trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrimes.map((prime) => (
                  <TableRow key={prime.id}>
                    <TableCell className="font-medium">{prime.numero_conteneur}</TableCell>
                    <TableCell>{prime.camion}</TableCell>
                    <TableCell>{prime.chauffeur || 'N/A'}</TableCell>
                    <TableCell>{prime.nom_client}</TableCell>
                    <TableCell>{new Date(prime.date_sortie).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      {prime.date_retour 
                        ? new Date(prime.date_retour).toLocaleDateString('fr-FR') 
                        : '-'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(prime.montant_prime)}
                    </TableCell>
                    <TableCell>{getStatusBadge(prime.statut)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(prime)}
                          disabled={prime.statut === 'paye'}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {prime.statut !== 'paye' && prime.date_retour && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkAsPaid(prime)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
